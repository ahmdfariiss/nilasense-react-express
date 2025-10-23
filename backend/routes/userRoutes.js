const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Definisikan rute GET untuk /
// Perhatikan urutannya: 'protect' dulu untuk verifikasi token, baru 'isAdmin' untuk cek peran
router.get("/", protect, isAdmin, userController.getAllUsers);

// GET /api/users/:id - Mendapatkan satu user berdasarkan ID
router.get("/:id", protect, isAdmin, userController.getUserById);

// POST /api/users - Membuat user baru (Admin only)
router.post("/", protect, isAdmin, userController.createUser);

// PUT /api/users/:id - Memperbarui data pengguna
router.put("/:id", protect, isAdmin, userController.updateUser);

// DELETE /api/users/:id - Menghapus pengguna
router.delete("/:id", protect, isAdmin, userController.deleteUser);

module.exports = router;
