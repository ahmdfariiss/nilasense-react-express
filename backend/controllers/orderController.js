const db = require("../db");

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXX
 */
const generateOrderNumber = async (client) => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  // Get count of orders today (using client for transaction consistency)
  const result = await client.query(
    `SELECT COUNT(*) as count 
    FROM orders 
    WHERE order_number LIKE $1`,
    [`ORD-${dateStr}-%`]
  );

  const count = parseInt(result.rows[0].count) + 1;
  const sequence = count.toString().padStart(4, "0");

  return `ORD-${dateStr}-${sequence}`;
};

/**
 * Create new order from cart
 * POST /api/orders
 * Body: { shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, payment_method, notes }
 */
exports.createOrder = async (req, res) => {
  let client;

  try {
    client = await db.pool.connect();
    const userId = req.user.id;
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      payment_method,
      notes,
    } = req.body;

    // Validation
    if (
      !shipping_name ||
      !shipping_phone ||
      !shipping_address ||
      !shipping_city ||
      !shipping_postal_code
    ) {
      return res.status(400).json({
        message: "Semua informasi pengiriman harus diisi",
      });
    }

    // Start transaction
    await client.query("BEGIN");

    // Get cart items with product details
    const cartResult = await client.query(
      `SELECT 
        c.id as cart_id,
        c.product_id,
        c.quantity,
        p.name as product_name,
        p.price,
        p.stock_kg,
        p.image_url,
        p.pond_id
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Keranjang kosong",
      });
    }

    const cartItems = cartResult.rows;

    // Validate stock availability and calculate total
    let subtotal = 0;

    for (const item of cartItems) {
      if (item.quantity > item.stock_kg) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: `Stok ${item.product_name} tidak mencukupi. Stok tersedia: ${item.stock_kg} kg`,
        });
      }

      subtotal += item.price * item.quantity;
    }

    const shipping_cost = 0; // Free shipping for now
    const total_amount = subtotal + shipping_cost;

    // Generate order number
    const order_number = await generateOrderNumber(client);

    // Determine order status based on payment method
    const finalPaymentMethod = payment_method || "manual_transfer";
    let orderStatus = "pending";
    let paymentStatus = "unpaid";
    let paymentGateway = "manual";

    // If Midtrans, order should be pending until payment is confirmed
    if (finalPaymentMethod === "midtrans") {
      orderStatus = "pending";
      paymentStatus = "unpaid";
      paymentGateway = "midtrans";
    } else if (finalPaymentMethod === "cash_on_delivery") {
      // COD - pending until delivered
      orderStatus = "pending";
      paymentStatus = "unpaid";
      paymentGateway = "manual";
    } else {
      // Manual transfer - set to paid (assuming manual confirmation)
      orderStatus = "paid";
      paymentStatus = "paid";
      paymentGateway = "manual";
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (
        order_number,
        user_id,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        subtotal,
        shipping_cost,
        total_amount,
        payment_method,
        notes,
        status,
        payment_status,
        payment_gateway
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        order_number,
        userId,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        subtotal,
        shipping_cost,
        total_amount,
        finalPaymentMethod,
        notes,
        orderStatus,
        paymentStatus,
        paymentGateway,
      ]
    );

    const order = orderResult.rows[0];

    // Create order items and update product stock
    for (const item of cartItems) {
      const itemSubtotal = item.price * item.quantity;

      // Insert order item
      await client.query(
        `INSERT INTO order_items (
          order_id,
          product_id,
          pond_id,
          product_name,
          product_image,
          product_price,
          quantity,
          subtotal
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.id,
          item.product_id,
          item.pond_id,
          item.product_name,
          item.image_url,
          item.price,
          item.quantity,
          itemSubtotal,
        ]
      );

      // Update product stock
      await client.query(
        `UPDATE products 
        SET stock_kg = stock_kg - $1 
        WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Clear cart after order is created
    await client.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    // Commit transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Pesanan berhasil dibuat",
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error creating order:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * Get all orders for logged-in user (buyer)
 * GET /api/orders
 */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get orders with first 3 items (for preview images)
    // Include admin_notes so buyers can see admin/petambak notes
    const result = await db.query(
      `SELECT 
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.total_amount,
        o.created_at,
        o.updated_at,
        o.admin_notes,
        COUNT(DISTINCT oi.id) as item_count,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', oi2.id,
                'product_name', oi2.product_name,
                'product_image', oi2.product_image,
                'quantity', oi2.quantity
              ) ORDER BY oi2.id
            )
            FROM (
              SELECT id, product_name, product_image, quantity
              FROM order_items
              WHERE order_id = o.id
              LIMIT 3
            ) oi2
          ),
          '[]'::json
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.created_at, o.updated_at, o.admin_notes
      ORDER BY o.created_at DESC`,
      [userId]
    );

    // Transform to ensure items is an array and parse JSON if needed
    const transformedResult = result.rows.map((order) => {
      let items = [];

      // Handle JSON string from PostgreSQL
      if (typeof order.items === "string") {
        try {
          items = JSON.parse(order.items);
        } catch (e) {
          items = [];
        }
      } else if (Array.isArray(order.items)) {
        items = order.items;
      }

      return {
        ...order,
        items: items,
        item_count: parseInt(order.item_count) || 0,
      };
    });

    res.status(200).json(transformedResult);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Get order detail by ID
 * GET /api/orders/:orderId
 * Accessible by: buyer (their own orders), admin (all orders), petambak (orders from their pond)
 */
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;
    const { orderId } = req.params;

    // Build query based on user role
    let orderQuery;
    let orderParams;

    if (userRole === "admin") {
      // Admin can see all orders
      orderQuery = `SELECT * FROM orders WHERE id = $1`;
      orderParams = [orderId];
    } else if (userRole === "petambak") {
      // Petambak can only see orders containing items from their pond
      orderQuery = `
        SELECT DISTINCT o.* 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1 AND oi.pond_id = $2
      `;
      orderParams = [orderId, userPondId];
    } else {
      // Buyer can only see their own orders
      orderQuery = `SELECT * FROM orders WHERE id = $1 AND user_id = $2`;
      orderParams = [orderId, userId];
    }

    const orderResult = await db.query(orderQuery, orderParams);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      `SELECT 
        oi.*,
        p.stock_kg as current_stock
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
      [orderId]
    );

    order.items = itemsResult.rows;

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Cancel order (buyer only, and only if pending)
 * PUT /api/orders/:orderId/cancel
 * Body: { reason }
 */
exports.cancelOrder = async (req, res) => {
  let client;

  try {
    client = await db.pool.connect();
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body;

    await client.query("BEGIN");

    // Check if order exists and belongs to user
    const orderCheck = await client.query(
      `SELECT id, status FROM orders WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Pesanan tidak ditemukan",
      });
    }

    const order = orderCheck.rows[0];

    // Only allow cancellation if order is pending
    if (order.status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message:
          "Pesanan tidak dapat dibatalkan. Hanya pesanan dengan status 'pending' yang dapat dibatalkan.",
      });
    }

    // Get order items to restore stock
    const itemsResult = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [orderId]
    );

    // Restore product stock
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE products 
        SET stock_kg = stock_kg + $1 
        WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    // Update order status
    await client.query(
      `UPDATE orders 
      SET status = 'cancelled',
          cancelled_reason = $1,
          cancelled_at = CURRENT_TIMESTAMP,
          cancelled_by = $2
      WHERE id = $3`,
      [reason || "Dibatalkan oleh pembeli", userId, orderId]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Pesanan berhasil dibatalkan",
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Error cancelling order:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * Get all orders for admin/petambak
 * GET /api/orders/admin/all
 * Admin: see ALL orders
 * Petambak: see only orders containing products from their assigned pond
 */
exports.getOrdersForAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;

    let query;
    let params;

    if (userRole === "admin") {
      // Admin can see ALL orders (no filtering)
      // Include first product name and total quantity for dashboard display
      query = `
        SELECT DISTINCT
          o.id,
          o.order_number,
          o.status,
          o.payment_status,
          o.payment_method,
          o.total_amount,
          o.created_at,
          o.updated_at,
          u.name as buyer_name,
          u.email as buyer_email,
          COUNT(DISTINCT oi.id) as item_count,
          (SELECT product_name FROM order_items WHERE order_id = o.id LIMIT 1) as first_product_name,
          (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id) as total_quantity
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id, u.name, u.email
        ORDER BY o.created_at DESC
      `;
      params = [];
    } else if (userRole === "petambak") {
      // Petambak can only see orders containing products from their assigned pond
      // Include first product name and total quantity for dashboard display
      query = `
        SELECT DISTINCT
          o.id,
          o.order_number,
          o.status,
          o.payment_status,
          o.payment_method,
          o.total_amount,
          o.created_at,
          o.updated_at,
          u.name as buyer_name,
          u.email as buyer_email,
          COUNT(DISTINCT oi.id) as item_count,
          (SELECT product_name FROM order_items WHERE order_id = o.id AND pond_id = $1 LIMIT 1) as first_product_name,
          (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id AND pond_id = $1) as total_quantity
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        WHERE oi.pond_id = $1
        GROUP BY o.id, u.name, u.email
        ORDER BY o.created_at DESC
      `;
      params = [userPondId];
    } else {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    const result = await db.query(query, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching orders for admin:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Update order status (admin/petambak only)
 * PUT /api/orders/:orderId/status
 * Body: { status, admin_notes }
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userPondId = req.user.pond_id;
    const { orderId } = req.params;
    const { status, admin_notes } = req.body;

    console.log("=== UPDATE ORDER STATUS REQUEST ===");
    console.log("Order ID:", orderId);
    console.log("Status:", status);
    console.log("Admin Notes (raw):", admin_notes);
    console.log("Admin Notes (type):", typeof admin_notes);
    console.log("User ID:", userId);
    console.log("User Role:", userRole);

    // Convert orderId to integer (from URL params string)
    const orderIdInt = parseInt(orderId, 10);

    // Validation
    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    // Check if admin/petambak has access to this order
    let accessQuery;
    let accessParams;

    if (userRole === "admin") {
      // Admin can access all orders
      accessQuery = `SELECT id FROM orders WHERE id = $1`;
      accessParams = [orderIdInt];
    } else if (userRole === "petambak") {
      // Petambak can only access orders from their pond
      accessQuery = `
        SELECT DISTINCT o.id 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = $1 AND oi.pond_id = $2
      `;
      accessParams = [orderIdInt, userPondId];
    } else {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    const accessCheck = await db.query(accessQuery, accessParams);

    if (accessCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Pesanan tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    // Update order status and payment_status
    // If status is 'paid', 'processing', 'shipped', or 'delivered' -> payment_status should be 'paid'
    // If status is 'cancelled' -> payment_status could be 'refunded' (but we keep it as is for now)
    const paymentStatus = [
      "paid",
      "processing",
      "shipped",
      "delivered",
    ].includes(status)
      ? "paid"
      : status === "cancelled"
      ? "refunded"
      : "unpaid";

    // Update order - set paid_at if status is 'paid' and not already set
    // Handle admin_notes: trim and convert empty strings to null
    let adminNotesValue = null;
    if (admin_notes !== undefined && admin_notes !== null) {
      const trimmedNotes = String(admin_notes).trim();
      adminNotesValue = trimmedNotes.length > 0 ? trimmedNotes : null;
    }

    console.log("Updating order:", {
      orderId: orderIdInt,
      status,
      paymentStatus,
      admin_notes: admin_notes,
      adminNotesValue: adminNotesValue,
    });

    const updateResult = await db.query(
      `UPDATE orders 
      SET status = $1::order_status, 
          payment_status = $2,
          admin_notes = $3,
          paid_at = CASE 
            WHEN $1::order_status = 'paid' AND paid_at IS NULL THEN CURRENT_TIMESTAMP 
            ELSE paid_at 
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 
      RETURNING *`,
      [status, paymentStatus, adminNotesValue, orderIdInt]
    );

    console.log("Update result:", {
      rowsAffected: updateResult.rows.length,
      updatedOrder: updateResult.rows[0]
        ? {
            id: updateResult.rows[0].id,
            status: updateResult.rows[0].status,
            admin_notes: updateResult.rows[0].admin_notes,
          }
        : null,
    });

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        message: "Gagal memperbarui status pesanan",
      });
    }

    res.status(200).json({
      message: "Status pesanan berhasil diperbarui",
      order: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
