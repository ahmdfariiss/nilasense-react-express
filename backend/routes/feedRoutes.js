const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// GET /api/feeds/:pondId - Mendapatkan jadwal pakan untuk satu kolam (Admin Only)
router.get(
  "/:pondId",
  protect,
  isAdmin,
  feedController.getFeedSchedulesByPondId
);

// POST /api/feeds - Menambah jadwal pakan baru (Admin Only)
router.post("/", protect, isAdmin, feedController.createFeedSchedule);

// PUT /api/feeds/:scheduleId - Memperbarui jadwal pakan (Admin Only)
router.put("/:scheduleId", protect, isAdmin, feedController.updateFeedSchedule);

module.exports = router;
