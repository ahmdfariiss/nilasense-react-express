// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Endpoint untuk registrasi user baru
router.post("/register", authController.registerUser);

// Endpoint untuk login user
router.post("/login", authController.loginUser);

// Endpoint untuk refresh token
router.post("/refresh-token", authController.refreshToken);

// Protected route
router.get("/me", protect, authController.getMe);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
