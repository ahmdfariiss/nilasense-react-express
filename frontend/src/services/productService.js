import api from "./api";

/**
 * Product Service
 * Handles all API calls related to products
 */

// Get all products (public endpoint)
export const getAllProducts = async () => {
  try {
    const response = await api.get("/products");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data produk",
    };
  }
};

// Get single product by ID (public endpoint)
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil detail produk",
    };
  }
};

// Create new product (admin only)
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return {
      success: true,
      data: response.data.product,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal membuat produk",
    };
  }
};

// Update product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return {
      success: true,
      data: response.data.product,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal memperbarui produk",
    };
  }
};

// Delete product (admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal menghapus produk",
    };
  }
};

// Get my products (for admin: all products, for petambak: only products from their pond)
export const getMyProducts = async () => {
  try {
    const response = await api.get("/products/my/products");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching my products:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengambil data produk",
    };
  }
};
