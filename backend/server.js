// Import library yang dibutuhkan
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const pondRoutes = require('./routes/pondRoutes');
const monitoringRoutes = require('./routes/monitoringRoutes');
const feedRoutes = require('./routes/feedRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
// Ganti port kembali ke 5001 jika perlu
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:5174', // Alternative local port
    process.env.FRONTEND_URL, // Production frontend URL
    /\.vercel\.app$/, // Semua subdomain vercel.app (untuk preview deployments)
  ].filter(Boolean), // Filter out undefined values
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Daftarkan Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ponds', pondRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/feeds', feedRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Endpoint (rute) pengujian sederhana
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di NilaSense Backend API!' });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
