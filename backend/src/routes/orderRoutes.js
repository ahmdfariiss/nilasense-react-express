const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, isAdminOrPetambak } = require("../middleware/authMiddleware");

/**
 * BUYER ROUTES (Protected - any logged-in user)
 */

/**
 * POST /api/orders
 * Create new order from cart
 * Body: { shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, payment_method, notes }
 */
router.post("/", protect, orderController.createOrder);

/**
 * GET /api/orders
 * Get all orders for logged-in buyer
 */
router.get("/", protect, orderController.getMyOrders);

/**
 * GET /api/orders/:orderId
 * Get order detail by ID
 */
router.get("/:orderId", protect, orderController.getOrderById);

/**
 * PUT /api/orders/:orderId/cancel
 * Cancel order (buyer only, pending orders only)
 * Body: { reason }
 */
router.put("/:orderId/cancel", protect, orderController.cancelOrder);

/**
 * ADMIN/PETAMBAK ROUTES
 */

/**
 * GET /api/orders/admin/all
 * Get all orders for admin/petambak (orders containing their products)
 */
router.get(
  "/admin/all",
  protect,
  isAdminOrPetambak,
  orderController.getOrdersForAdmin
);

/**
 * PUT /api/orders/:orderId/status
 * Update order status (admin/petambak only)
 * Body: { status, admin_notes }
 */
router.put(
  "/:orderId/status",
  protect,
  isAdminOrPetambak,
  orderController.updateOrderStatus
);

module.exports = router;

