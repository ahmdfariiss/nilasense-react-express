// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  protect,
  isAdmin,
  isAdminOrPetambak,
} = require("../middleware/authMiddleware");
const { uploadSingle } = require("../middleware/uploadMiddleware");

// GET /api/products - Mendapatkan semua produk (dengan optional query ?pond_id=X)
// Rute ini publik, jadi tidak perlu middleware 'protect' atau 'isAdmin'
router.get("/", productController.getAllProducts);

// GET /api/products/my/products - Mendapatkan produk milik admin/petambak yang sedang login
// IMPORTANT: Harus di atas /:id karena lebih spesifik
router.get(
  "/my/products",
  protect,
  isAdminOrPetambak,
  productController.getMyProducts
);

// GET /api/products/pond/:pond_id - Mendapatkan produk berdasarkan kolam tertentu
// IMPORTANT: Harus di atas /:id karena lebih spesifik
router.get("/pond/:pond_id", productController.getProductsByPond);

// GET /api/products/:id - Mendapatkan satu produk berdasarkan ID
router.get("/:id", productController.getProductById);

// POST /api/products/upload-image - Upload gambar produk (Admin & Petambak)
router.post(
  "/upload-image",
  protect,
  isAdminOrPetambak,
  uploadSingle,
  productController.uploadImage
);

// POST /api/products - Membuat produk baru (Admin & Petambak)
router.post(
  "/",
  protect,
  isAdminOrPetambak,
  uploadSingle,
  productController.createProduct
);

// PUT /api/products/:id - Memperbarui produk (Admin & Petambak)
router.put(
  "/:id",
  protect,
  isAdminOrPetambak,
  uploadSingle,
  productController.updateProduct
);

// DELETE /api/products/:id - Menghapus produk (Admin & Petambak)
router.delete(
  "/:id",
  protect,
  isAdminOrPetambak,
  productController.deleteProduct
);

module.exports = router;
