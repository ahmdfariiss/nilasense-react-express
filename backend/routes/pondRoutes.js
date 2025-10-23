// backend/routes/pondRoutes.js
const express = require("express");
const router = express.Router();
const pondController = require("../controllers/pondController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// IMPORTANT: Specific routes must come BEFORE generic parameterized routes

// GET /api/ponds - Mendapatkan semua kolam (Admin Only)
router.get("/", protect, isAdmin, pondController.getAllPonds);

// GET /api/ponds/accessible - Mendapatkan kolam yang bisa diakses user (Buyer & Admin)
router.get("/accessible", protect, pondController.getAccessiblePonds);

// GET /api/ponds/:id - Mendapatkan satu kolam berdasarkan ID (Admin Only)
router.get("/:id", protect, isAdmin, pondController.getPondById);

// POST /api/ponds - Menambah kolam baru (Admin Only)
router.post("/", protect, isAdmin, pondController.createPond);

// PUT /api/ponds/:id - Memperbarui data kolam (Admin Only)
router.put("/:id", protect, isAdmin, pondController.updatePond);

// DELETE /api/ponds/:id - Menghapus data kolam (Admin Only)
router.delete("/:id", protect, isAdmin, pondController.deletePond);

module.exports = router;
