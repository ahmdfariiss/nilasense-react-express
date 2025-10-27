import api from "./api";

/**
 * Get all cart items for logged-in user
 * @returns {Promise<{success: boolean, data?: array, error?: string}>}
 */
export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data keranjang",
    };
  }
};

/**
 * Get cart item count
 * @returns {Promise<{success: boolean, count?: number, error?: string}>}
 */
export const getCartCount = async () => {
  try {
    const response = await api.get("/cart/count");
    return { success: true, count: response.data.count };
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return {
      success: false,
      count: 0,
      error:
        error.response?.data?.message ||
        "Gagal mengambil jumlah item keranjang",
    };
  }
};

/**
 * Add item to cart
 * @param {number} productId
 * @param {number} quantity
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const addToCart = async (productId, quantity) => {
  try {
    const response = await api.post("/cart", {
      product_id: productId,
      quantity: quantity,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Gagal menambahkan produk ke keranjang",
    };
  }
};

/**
 * Update cart item quantity
 * @param {number} cartId
 * @param {number} quantity
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateCartItem = async (cartId, quantity) => {
  try {
    const response = await api.put(`/cart/${cartId}`, {
      quantity: quantity,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui keranjang",
    };
  }
};

/**
 * Remove item from cart
 * @param {number} cartId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const removeFromCart = async (cartId) => {
  try {
    const response = await api.delete(`/cart/${cartId}`);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Gagal menghapus item dari keranjang",
    };
  }
};

/**
 * Clear all cart items
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengosongkan keranjang",
    };
  }
};

const cartService = {
  getCart,
  getCartCount,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;

