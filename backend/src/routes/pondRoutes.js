// backend/routes/pondRoutes.js
const express = require("express");
const router = express.Router();
const pondController = require("../controllers/pondController");
const {
  protect,
  isAdmin,
  isAdminOrPetambak,
} = require("../middleware/authMiddleware");

// IMPORTANT: Specific routes must come BEFORE generic parameterized routes

// GET /api/ponds - Mendapatkan semua kolam (Admin & Petambak)
router.get("/", protect, isAdminOrPetambak, pondController.getAllPonds);

// GET /api/ponds/accessible - Mendapatkan kolam yang bisa diakses user (Buyer & Admin)
router.get("/accessible", protect, pondController.getAccessiblePonds);

// GET /api/ponds/:id - Mendapatkan satu kolam berdasarkan ID (Admin & Petambak)
router.get("/:id", protect, isAdminOrPetambak, pondController.getPondById);

// POST /api/ponds - Menambah kolam baru (Admin Only)
router.post("/", protect, isAdmin, pondController.createPond);

// PUT /api/ponds/:id - Memperbarui data kolam (Admin & Petambak)
router.put("/:id", protect, isAdminOrPetambak, pondController.updatePond);

// DELETE /api/ponds/:id - Menghapus data kolam (Admin Only)
router.delete("/:id", protect, isAdmin, pondController.deletePond);

module.exports = router;
