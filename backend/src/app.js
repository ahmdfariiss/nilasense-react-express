// Import library yang dibutuhkan
const express = require("express");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const pondRoutes = require("./routes/pondRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const feedRoutes = require("./routes/feedRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Daftarkan Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ponds", pondRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// Endpoint (rute) pengujian sederhana
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di NilaSense Backend API!" });
});

module.exports = app;
