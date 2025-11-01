const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const {
  protect,
  isAdmin,
  isAdminOrPetambak,
} = require("../middleware/authMiddleware");

// IMPORTANT: Specific routes must come BEFORE generic parameterized routes

// GET /api/feeds/accessible/:pondId - Mendapatkan jadwal pakan yang bisa diakses (Buyer, Admin & Petambak)
router.get(
  "/accessible/:pondId",
  protect,
  feedController.getAccessibleFeedSchedules
);

// GET /api/feeds/summary/:pondId - Mendapatkan ringkasan jadwal pakan hari ini (Buyer, Admin & Petambak)
router.get("/summary/:pondId", protect, feedController.getTodayFeedSummary);

// GET /api/feeds/:pondId - Mendapatkan jadwal pakan untuk satu kolam (Admin & Petambak)
router.get(
  "/:pondId",
  protect,
  isAdminOrPetambak,
  feedController.getFeedSchedulesByPondId
);

// POST /api/feeds - Menambah jadwal pakan baru (Admin & Petambak)
router.post("/", protect, isAdminOrPetambak, feedController.createFeedSchedule);

// PUT /api/feeds/:scheduleId - Memperbarui jadwal pakan (Buyer, Admin & Petambak)
router.put("/:scheduleId", protect, feedController.updateFeedSchedule);

// DELETE /api/feeds/:scheduleId - Menghapus jadwal pakan (Admin & Petambak)
router.delete(
  "/:scheduleId",
  protect,
  isAdminOrPetambak,
  feedController.deleteFeedSchedule
);

module.exports = router;
