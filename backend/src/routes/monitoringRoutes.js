const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// POST /api/monitoring/logs - Menambah data log sensor baru (Admin Only)
router.post("/logs", protect, isAdmin, monitoringController.addLog);

// GET /api/monitoring/logs/:pondId - Mendapatkan data log untuk satu kolam (Buyer & Admin)
router.get("/logs/:pondId", protect, monitoringController.getLogsByPondId);

// POST /api/monitoring/analyze - Memicu analisis ML (Admin Only)
router.post(
  "/analyze",
  protect,
  isAdmin,
  monitoringController.analyzeWaterQuality
);

module.exports = router;
