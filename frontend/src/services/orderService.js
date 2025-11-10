import api from "./api";

/**
 * Create new order from cart
 * @param {object} orderData - { shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, payment_method, notes }
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat pesanan",
    };
  }
};

/**
 * Get all orders for logged-in buyer
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getMyOrders = async () => {
  try {
    const response = await api.get("/orders");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Gagal mengambil data riwayat pesanan",
    };
  }
};

/**
 * Get order detail by ID
 * @param {number} orderId
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil detail pesanan",
    };
  }
};

/**
 * Cancel order
 * @param {number} orderId
 * @param {string} reason
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`, { reason });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membatalkan pesanan",
    };
  }
};

/**
 * Get all orders for admin/petambak (orders containing their products)
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getOrdersForAdmin = async () => {
  try {
    const response = await api.get("/orders/admin/all");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data pesanan",
    };
  }
};

/**
 * Update order status (admin/petambak only)
 * @param {number} orderId
 * @param {object} data - {status, admin_notes}
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateOrderStatus = async (orderId, data) => {
  try {
    console.log("Sending update request:", { orderId, data });
    const response = await api.put(`/orders/${orderId}/status`, data);
    console.log("Update response:", response.data);

    if (response.data && response.data.message) {
      return { success: true, data: response.data };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating order status:", error);
    console.error("Error response:", error.response?.data);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Gagal memperbarui status pesanan";
    throw new Error(errorMessage);
  }
};

/**
 * Create Midtrans payment token
 * @param {number} orderId
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createPayment = async (orderId) => {
  try {
    const response = await api.post("/payments/create", { order_id: orderId });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating payment:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat payment token",
      data: error.response?.data, // Include full error response including hint
    };
  }
};

/**
 * Check payment status
 * @param {number} orderId
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const checkPaymentStatus = async (orderId) => {
  try {
    const response = await api.get(`/payments/status/${orderId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Gagal memeriksa status pembayaran",
    };
  }
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrdersForAdmin,
  updateOrderStatus,
  createPayment,
  checkPaymentStatus,
};

export default orderService;
