const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController");
const {
  protect,
  isAdmin,
  isAdminOrPetambak,
} = require("../middleware/authMiddleware");

// POST /api/monitoring/logs - Menambah data log sensor baru (Admin & Petambak)
router.post("/logs", protect, isAdminOrPetambak, monitoringController.addLog);

// GET /api/monitoring/logs/:pondId - Mendapatkan data log untuk satu kolam (Buyer, Admin & Petambak)
router.get("/logs/:pondId", protect, monitoringController.getLogsByPondId);

// POST /api/monitoring/analyze - Memicu analisis ML (Admin & Petambak)
router.post(
  "/analyze",
  protect,
  isAdminOrPetambak,
  monitoringController.analyzeWaterQuality
);

module.exports = router;
