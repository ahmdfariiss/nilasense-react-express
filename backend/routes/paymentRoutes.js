const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

/**
 * POST /api/payments/create
 * Create Midtrans payment token/snap URL
 * Body: { order_id }
 * Protected: Yes (buyer only)
 */
router.post("/create", protect, paymentController.createPayment);

/**
 * POST /api/payments/webhook
 * Handle Midtrans webhook notification
 * This endpoint is called by Midtrans when payment status changes
 * Protected: No (Midtrans will call this endpoint)
 */
router.post("/webhook", paymentController.handleWebhook);

/**
 * GET /api/payments/status/:orderId
 * Check payment status for an order
 * Protected: Yes (buyer only - can only check their own orders)
 */
router.get("/status/:orderId", protect, paymentController.checkPaymentStatus);

module.exports = router;



















