// Import library yang dibutuhkan
require("dotenv").config();
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

const app = express();
// Ganti port kembali ke 5001 jika perlu
const PORT = process.env.PORT || 5001;

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

// Endpoint (rute) pengujian sederhana
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di NilaSense Backend API!" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
