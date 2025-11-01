const db = require("../config/database");
const midtransClient = require("midtrans-client");

// Function to get Midtrans Snap instance (lazy initialization)
const getSnapInstance = () => {
  if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
    console.warn(
      "⚠️  WARNING: Midtrans Server Key or Client Key not set in environment variables!"
    );
    console.warn("Current env check:");
    console.warn(
      "  MIDTRANS_SERVER_KEY:",
      process.env.MIDTRANS_SERVER_KEY || "undefined"
    );
    console.warn(
      "  MIDTRANS_CLIENT_KEY:",
      process.env.MIDTRANS_CLIENT_KEY || "undefined"
    );
    console.warn("Please add the following to your .env file:");
    console.warn("MIDTRANS_SERVER_KEY=your_server_key_here");
    console.warn("MIDTRANS_CLIENT_KEY=your_client_key_here");
    console.warn("MIDTRANS_IS_PRODUCTION=false");
  }

  return new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
  });
};

/**
 * Create Midtrans payment token/snap URL
 * POST /api/payments/create
 * Body: { order_id }
 */
exports.createPayment = async (req, res) => {
  try {
    console.log("🔵 [createPayment] Starting payment creation...");

    // Check if Midtrans is configured
    if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
      console.error("❌ [createPayment] Midtrans keys not configured");
      return res.status(500).json({
        message: "Konfigurasi Midtrans belum lengkap",
        error:
          "Server Key atau Client Key belum di-set. Silakan tambahkan MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY ke file .env",
      });
    }

    const userId = req.user.id;
    const { order_id } = req.body;

    console.log(`🔵 [createPayment] User ID: ${userId}, Order ID: ${order_id}`);

    if (!order_id) {
      return res.status(400).json({
        message: "Order ID harus diisi",
      });
    }

    // Get order details
    console.log("🔵 [createPayment] Fetching order details...");
    const orderResult = await db.query(
      `SELECT 
        o.id,
        o.order_number,
        o.user_id,
        o.total_amount,
        o.shipping_name,
        o.shipping_phone,
        o.shipping_address,
        o.shipping_city,
        o.shipping_postal_code,
        o.status,
        o.payment_status,
        o.transaction_id,
        u.email,
        u.name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1 AND o.user_id = $2`,
      [order_id, userId]
    );

    if (orderResult.rows.length === 0) {
      console.error(
        `❌ [createPayment] Order not found: ${order_id} for user ${userId}`
      );
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    const order = orderResult.rows[0];
    console.log(
      `✅ [createPayment] Order found: ${order.order_number}, Status: ${order.status}, Payment Status: ${order.payment_status}`
    );
    console.log(
      `✅ [createPayment] Transaction ID: ${order.transaction_id || "None"}`
    );

    // Check if order is already paid
    if (order.payment_status === "paid") {
      console.warn(`⚠️ [createPayment] Order already paid`);
      return res.status(400).json({
        message: "Pesanan sudah dibayar",
      });
    }

    // If order already has a transaction_id (token), reuse it instead of creating new one
    if (
      order.transaction_id &&
      order.transaction_id.length > 0 &&
      order.payment_status === "unpaid"
    ) {
      console.log("✅ [createPayment] Reusing existing payment token");
      return res.status(200).json({
        message: "Payment token sudah tersedia",
        data: {
          token: order.transaction_id,
          redirect_url: null, // We can't get redirect_url from stored token, but token is enough
          order_id: order.order_number,
          reused: true,
        },
      });
    }

    // Check if order status allows payment
    if (order.status !== "pending") {
      console.warn(
        `⚠️ [createPayment] Order status is not pending: ${order.status}`
      );
      return res.status(400).json({
        message: "Pesanan tidak dapat dibayar",
      });
    }

    // Get order items for item details
    console.log("🔵 [createPayment] Fetching order items...");
    const itemsResult = await db.query(
      `SELECT 
        product_name,
        quantity,
        product_price,
        subtotal
      FROM order_items
      WHERE order_id = $1`,
      [order_id]
    );

    const items = itemsResult.rows;
    console.log(`✅ [createPayment] Found ${items.length} order items`);

    // Validate items
    if (!items || items.length === 0) {
      console.error("❌ [createPayment] No order items found");
      return res.status(400).json({
        message: "Pesanan tidak memiliki item",
      });
    }

    // Prepare Midtrans parameter
    // Generate unique order_id by appending timestamp to avoid "already taken" error
    const uniqueOrderId = `${order.order_number}-${Date.now()}`;
    console.log("🔵 [createPayment] Preparing Midtrans parameters...");
    console.log(`🔵 [createPayment] Using unique order_id: ${uniqueOrderId}`);

    const parameter = {
      transaction_details: {
        order_id: uniqueOrderId, // Use unique order_id to avoid "already taken" error
        gross_amount: parseInt(order.total_amount), // Must be integer
      },
      customer_details: {
        first_name: order.shipping_name,
        email: order.email,
        phone: order.shipping_phone,
        billing_address: {
          first_name: order.shipping_name,
          phone: order.shipping_phone,
          address: order.shipping_address,
          city: order.shipping_city,
          postal_code: order.shipping_postal_code,
          country_code: "IDN",
        },
        shipping_address: {
          first_name: order.shipping_name,
          phone: order.shipping_phone,
          address: order.shipping_address,
          city: order.shipping_city,
          postal_code: order.shipping_postal_code,
          country_code: "IDN",
        },
      },
      item_details: items.map((item) => ({
        id: item.product_name,
        price: parseInt(item.product_price),
        quantity: item.quantity,
        name: item.product_name,
      })),
      // Enable payment methods
      enabled_payments: [
        "credit_card",
        "mandiri_clickpay",
        "cimb_clicks",
        "bca_klikbca",
        "bca_klikpay",
        "bri_epay",
        "telkomsel_cash",
        "echannel",
        "permata_va",
        "bca_va",
        "bni_va",
        "other_va",
        "gopay",
        "kioson",
        "indomaret",
        "alfamart",
      ],
    };

    // Create snap transaction
    console.log("🔵 [createPayment] Creating Midtrans transaction...");
    console.log(
      "🔵 [createPayment] Parameter:",
      JSON.stringify(
        {
          order_id: parameter.transaction_details.order_id,
          gross_amount: parameter.transaction_details.gross_amount,
          item_count: parameter.item_details.length,
        },
        null,
        2
      )
    );

    const snap = getSnapInstance();
    let transaction;

    try {
      transaction = await snap.createTransaction(parameter);
      console.log(
        "✅ [createPayment] Midtrans transaction created successfully"
      );
      console.log(
        "✅ [createPayment] Token:",
        transaction.token ? "Received" : "Missing"
      );
    } catch (midtransError) {
      console.error(
        "❌ [createPayment] Midtrans API error:",
        midtransError.message
      );
      console.error("❌ [createPayment] Full error:", midtransError);
      throw new Error(`Midtrans API Error: ${midtransError.message}`);
    }

    // Store snap token and uniqueOrderId (Midtrans order_id)
    // We need to store uniqueOrderId so we can match it later in webhook and checkPaymentStatus
    // We'll store it in transaction_id field temporarily (format: "TOKEN|uniqueOrderId")
    // After payment, webhook will update with actual Midtrans transaction_id
    console.log(
      "🔵 [createPayment] Storing token and Midtrans order_id to database..."
    );
    try {
      // Store token and uniqueOrderId together temporarily
      // Format: token|uniqueOrderId (we'll parse it later if needed)
      // But actually, we can store just the token, and retrieve uniqueOrderId from Midtrans API using the token
      // Or better: store uniqueOrderId in transaction_id with a prefix before actual transaction_id arrives
      const tokenWithOrderId = `${transaction.token}|ORDER_ID:${uniqueOrderId}`;

      await db.query(
        `UPDATE orders 
        SET transaction_id = $1,
            payment_gateway = 'midtrans'
        WHERE id = $2`,
        [tokenWithOrderId, order_id]
      );

      console.log(
        `✅ [createPayment] Token stored. Midtrans order_id: ${uniqueOrderId}`
      );
    } catch (dbError) {
      console.error(
        "❌ [createPayment] Database update error:",
        dbError.message
      );
      throw new Error(`Database Error: ${dbError.message}`);
    }

    console.log("✅ [createPayment] Payment token created successfully");
    res.status(200).json({
      message: "Payment token berhasil dibuat",
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: order.order_number,
      },
    });
  } catch (error) {
    console.error("❌ Error creating payment:", error.message);
    console.error("Full error:", error);
    console.error("Stack trace:", error.stack);

    // More detailed error response
    const errorMessage = error.message || "Unknown error";
    const isMidtransError =
      errorMessage.includes("401") || errorMessage.includes("Unauthorized");

    res.status(500).json({
      message: "Gagal membuat payment token",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      hint: isMidtransError
        ? "Kesalahan autentikasi Midtrans. Pastikan MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY sudah benar di file .env"
        : "Terjadi kesalahan saat membuat token pembayaran. Silakan coba lagi atau hubungi admin.",
    });
  }
};

/**
 * Handle Midtrans webhook notification
 * POST /api/payments/webhook
 * This endpoint is called by Midtrans when payment status changes
 */
exports.handleWebhook = async (req, res) => {
  let client;

  try {
    // Midtrans sends notification in specific format
    const notificationJson = req.body;

    console.log(
      "🔔 Webhook received from Midtrans:",
      JSON.stringify(notificationJson, null, 2)
    );

    // Verify the notification (Midtrans will send transaction_status and other fields)
    const orderId =
      notificationJson.transaction_details?.order_id ||
      notificationJson.order_id;
    const transactionStatus = notificationJson.transaction_status;
    const fraudStatus = notificationJson.fraud_status;
    const transactionId = notificationJson.transaction_id;

    console.log(
      `📦 Processing webhook for order: ${orderId}, status: ${transactionStatus}, transaction_id: ${transactionId}`
    );

    if (!orderId) {
      console.error("❌ Webhook error: order_id missing");
      return res.status(400).json({
        message: "Invalid notification: order_id missing",
      });
    }

    // Start transaction
    client = await db.pool.connect();
    await client.query("BEGIN");

    // Find order by uniqueOrderId (Midtrans order_id)
    // The orderId from webhook is the uniqueOrderId (format: ORD-20251025-0001-1234567890)
    // We need to find order where transaction_id contains this uniqueOrderId
    // Format stored: token|ORDER_ID:uniqueOrderId
    let orderResult = await client.query(
      `SELECT id, status, payment_status, user_id, transaction_id 
       FROM orders 
       WHERE transaction_id LIKE $1 OR order_number = $2`,
      [`%ORDER_ID:${orderId}%`, orderId]
    );

    // If not found, try to extract order_number from uniqueOrderId (remove timestamp)
    // Format: ORD-20251025-0001-1234567890 -> ORD-20251025-0001
    if (orderResult.rows.length === 0 && orderId.includes("-")) {
      const parts = orderId.split("-");
      if (parts.length >= 3) {
        // Remove last part (timestamp) and reconstruct order_number
        const orderNumber = parts.slice(0, -1).join("-");
        orderResult = await client.query(
          `SELECT id, status, payment_status, user_id, transaction_id 
           FROM orders 
           WHERE order_number = $1`,
          [orderNumber]
        );
      }
    }

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      console.error(`❌ Order not found: ${orderId}`);
      return res.status(404).json({
        message: "Order tidak ditemukan",
      });
    }

    const order = orderResult.rows[0];
    console.log(
      `✅ Order found: ID ${order.id}, Current status: ${order.status}, Payment status: ${order.payment_status}`
    );

    // Handle different transaction statuses
    if (transactionStatus === "capture") {
      // Credit card transaction
      if (fraudStatus === "accept") {
        // Update order to paid
        await client.query(
          `UPDATE orders 
          SET payment_status = 'paid',
              status = 'paid',
              paid_at = CURRENT_TIMESTAMP,
              transaction_id = $1,
              payment_gateway = 'midtrans',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2`,
          [transactionId, order.id]
        );
      }
    } else if (transactionStatus === "settlement") {
      // Payment is settled (successful)
      console.log(`✅ Updating order ${order.id} to PAID (settlement)`);
      // Store actual Midtrans transaction_id
      // Keep the uniqueOrderId info for future reference if needed, but use actual transaction_id
      const actualTransactionId = transactionId ? String(transactionId) : null;

      await client.query(
        `UPDATE orders 
        SET payment_status = 'paid',
            status = 'paid',
            paid_at = CURRENT_TIMESTAMP,
            transaction_id = $1,
            payment_gateway = 'midtrans',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [actualTransactionId, order.id]
      );

      console.log(
        `✅ Order ${order.id} updated to PAID. Transaction ID: ${actualTransactionId}`
      );
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      // Payment failed/cancelled
      await client.query(
        `UPDATE orders 
        SET payment_status = 'unpaid',
            status = 'pending',
            transaction_id = $1,
            payment_gateway = 'midtrans',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [transactionId, order.id]
      );
    } else if (transactionStatus === "pending") {
      // Payment is pending
      await client.query(
        `UPDATE orders 
        SET payment_status = 'unpaid',
            status = 'pending',
            transaction_id = $1,
            payment_gateway = 'midtrans',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [transactionId, order.id]
      );
    }

    await client.query("COMMIT");

    console.log(`✅ Webhook processed successfully for order ${orderId}`);

    // Always return 200 to Midtrans (they will retry if we return error)
    res.status(200).json({
      message: "Webhook processed successfully",
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error processing webhook:", error.message);
    console.error("Full error:", error);
    // Still return 200 to prevent Midtrans from retrying
    res.status(200).json({
      message: "Webhook received but processing failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * Check payment status
 * GET /api/payments/status/:orderId
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const orderResult = await db.query(
      `SELECT 
        id,
        order_number,
        status,
        payment_status,
        transaction_id,
        payment_gateway,
        total_amount
      FROM orders
      WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    const order = orderResult.rows[0];

    // If using Midtrans, check status from Midtrans API
    // First, try to extract uniqueOrderId from transaction_id if it contains it
    // Format: token|ORDER_ID:uniqueOrderId (before payment) or actual transaction_id (after payment)
    if (order.payment_gateway === "midtrans" && order.transaction_id) {
      try {
        const snap = getSnapInstance();
        let midtransOrderId = null;

        // Try to extract uniqueOrderId from transaction_id
        if (order.transaction_id.includes("|ORDER_ID:")) {
          const parts = order.transaction_id.split("|ORDER_ID:");
          if (parts.length > 1) {
            midtransOrderId = parts[1];
          }
        }

        // If we can't extract uniqueOrderId from stored format,
        // it means transaction_id might already be updated with actual Midtrans transaction_id (after payment)
        // In that case, we can't check status using uniqueOrderId, but we should check if payment is already paid
        // If payment_status is already 'paid', we don't need to check Midtrans
        if (!midtransOrderId) {
          console.log(
            `⚠️ [checkPaymentStatus] Could not extract uniqueOrderId from transaction_id: ${order.transaction_id}`
          );
          console.log(
            `⚠️ [checkPaymentStatus] This might mean payment is already processed. Current status: ${order.payment_status}`
          );

          // If already paid, return current status
          if (order.payment_status === "paid") {
            return res.status(200).json({
              order: order,
            });
          }

          // If not paid, try to check using transaction_id directly (might be actual Midtrans transaction_id)
          // But Midtrans API doesn't support checking by transaction_id directly, only by order_id
          // So we need to return current status and rely on webhook
          console.log(
            `⚠️ [checkPaymentStatus] Cannot check Midtrans status without uniqueOrderId. Relying on webhook.`
          );
          return res.status(200).json({
            order: order,
          });
        }

        console.log(
          `🔍 [checkPaymentStatus] Checking Midtrans status for order_id: ${midtransOrderId}`
        );
        const transactionStatus = await snap.transaction.status(
          midtransOrderId
        );

        // Update order status based on Midtrans status
        let paymentStatus = order.payment_status;
        let orderStatus = order.status;

        console.log(
          `🔍 Midtrans transaction status: ${transactionStatus.transaction_status}`
        );
        console.log(
          `🔍 Current order status: ${orderStatus}, payment status: ${paymentStatus}`
        );

        if (
          transactionStatus.transaction_status === "settlement" ||
          transactionStatus.transaction_status === "capture"
        ) {
          paymentStatus = "paid";
          orderStatus = "paid";
          console.log(`✅ Payment confirmed - updating to paid`);
        } else if (transactionStatus.transaction_status === "pending") {
          paymentStatus = "unpaid";
          orderStatus = "pending";
        } else if (
          transactionStatus.transaction_status === "cancel" ||
          transactionStatus.transaction_status === "deny" ||
          transactionStatus.transaction_status === "expire"
        ) {
          paymentStatus = "unpaid";
          orderStatus = "pending";
        }

        // Update database if status changed
        if (
          paymentStatus !== order.payment_status ||
          orderStatus !== order.status
        ) {
          // Get actual transaction_id from Midtrans response
          const newTransactionId = transactionStatus.transaction_id
            ? String(transactionStatus.transaction_id)
            : null;

          // Use actual transaction_id from Midtrans response if available
          // If payment is paid, prefer actual transaction_id from Midtrans
          // Otherwise, keep existing transaction_id (might still be in token|ORDER_ID format)
          let finalTransactionId = newTransactionId;
          if (!finalTransactionId && paymentStatus === "paid") {
            // If payment is paid but no transaction_id from Midtrans, clean up stored format
            if (order.transaction_id && order.transaction_id.includes("|")) {
              // Extract just the token part (before |)
              finalTransactionId = order.transaction_id.split("|")[0];
            } else {
              finalTransactionId = order.transaction_id;
            }
          } else if (!finalTransactionId) {
            // Keep existing format if not paid
            finalTransactionId = order.transaction_id;
          }

          await db.query(
            `UPDATE orders 
            SET payment_status = $1::VARCHAR,
                status = $2::order_status,
                transaction_id = $4::VARCHAR,
                paid_at = CASE 
                  WHEN $1::VARCHAR = 'paid' AND paid_at IS NULL THEN CURRENT_TIMESTAMP 
                  ELSE paid_at 
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3::INTEGER`,
            [paymentStatus, orderStatus, order.id, finalTransactionId]
          );

          console.log(
            `✅ [checkPaymentStatus] Updated order ${order.id}: payment_status=${paymentStatus}, status=${orderStatus}`
          );

          // Update order object to reflect changes
          order.payment_status = paymentStatus;
          order.status = orderStatus;
          if (transactionStatus.transaction_id) {
            order.transaction_id = transactionStatus.transaction_id;
          }
        }

        return res.status(200).json({
          order: {
            ...order,
            payment_status: paymentStatus,
            status: orderStatus,
          },
          midtrans_status: transactionStatus,
        });
      } catch (midtransError) {
        console.error("Error checking Midtrans status:", midtransError);
        // Return current order status if Midtrans API fails
      }
    }

    res.status(200).json({
      order: order,
    });
  } catch (error) {
    console.error("Error checking payment status:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
