const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All cart routes require authentication
router.use(protect);

/**
 * GET /api/cart/count
 * Get cart item count for logged-in user
 */
router.get("/count", cartController.getCartCount);

/**
 * GET /api/cart
 * Get all cart items for logged-in user
 */
router.get("/", cartController.getCart);

/**
 * POST /api/cart
 * Add item to cart
 * Body: { product_id, quantity }
 */
router.post("/", cartController.addToCart);

/**
 * PUT /api/cart/:cartId
 * Update cart item quantity
 * Body: { quantity }
 */
router.put("/:cartId", cartController.updateCartItem);

/**
 * DELETE /api/cart/:cartId
 * Remove specific item from cart
 */
router.delete("/:cartId", cartController.removeFromCart);

/**
 * DELETE /api/cart
 * Clear all cart items (must be placed after /:cartId route)
 */
// NOTE: This route is intentionally commented out to prevent accidental cart clearing
// Uncomment if needed, but be careful with route ordering
// router.delete("/", cartController.clearCart);

module.exports = router;

