// Import library yang dibutuhkan
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Inisialisasi aplikasi express
const app = express();
const PORT = process.env.PORT || 5000; // Gunakan port dari .env atau default ke 5000
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors()); // Mengizinkan request dari domain lain (frontend React Anda)
app.use(express.json()); // Mem-parsing body request dalam format JSON

app.use("/api/auth", authRoutes); // Menggunakan prefix /api/auth
app.use("/api/users", userRoutes);

// Endpoint (rute) pengujian sederhana
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di NilaSense Backend API!" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
