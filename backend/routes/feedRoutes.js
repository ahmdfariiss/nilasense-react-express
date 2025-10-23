const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// IMPORTANT: Specific routes must come BEFORE generic parameterized routes

// GET /api/feeds/accessible/:pondId - Mendapatkan jadwal pakan yang bisa diakses (Buyer & Admin)
router.get(
  "/accessible/:pondId",
  protect,
  feedController.getAccessibleFeedSchedules
);

// GET /api/feeds/summary/:pondId - Mendapatkan ringkasan jadwal pakan hari ini (Buyer & Admin)
router.get("/summary/:pondId", protect, feedController.getTodayFeedSummary);

// GET /api/feeds/:pondId - Mendapatkan jadwal pakan untuk satu kolam (Admin Only)
router.get(
  "/:pondId",
  protect,
  isAdmin,
  feedController.getFeedSchedulesByPondId
);

// POST /api/feeds - Menambah jadwal pakan baru (Admin Only)
router.post("/", protect, isAdmin, feedController.createFeedSchedule);

// PUT /api/feeds/:scheduleId - Memperbarui jadwal pakan (Buyer & Admin)
router.put("/:scheduleId", protect, feedController.updateFeedSchedule);

// DELETE /api/feeds/:scheduleId - Menghapus jadwal pakan (Admin Only)
router.delete(
  "/:scheduleId",
  protect,
  isAdmin,
  feedController.deleteFeedSchedule
);

module.exports = router;
