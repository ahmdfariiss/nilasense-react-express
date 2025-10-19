// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// GET /api/products - Mendapatkan semua produk
// Rute ini publik, jadi tidak perlu middleware 'protect' atau 'isAdmin'
router.get("/", productController.getAllProducts);

// GET /api/products/:id - Mendapatkan satu produk berdasarkan ID
router.get("/:id", productController.getProductById);

// POST /api/products - Membuat produk baru (Admin Only)
router.post("/", protect, isAdmin, productController.createProduct);

// PUT /api/products/:id - Memperbarui produk (Admin Only)
router.put("/:id", protect, isAdmin, productController.updateProduct);

// DELETE /api/products/:id - Menghapus produk (Admin Only)
router.delete("/:id", protect, isAdmin, productController.deleteProduct);

module.exports = router;
