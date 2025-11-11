# 🐟 NilaSense - Sistem Manajemen Budidaya Ikan Nila

NilaSense adalah platform komprehensif untuk manajemen budidaya ikan nila yang dilengkapi dengan monitoring kualitas air berbasis IoT, prediksi kualitas air menggunakan Machine Learning, manajemen kolam, manajemen pakan, dan e-commerce untuk penjualan produk.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Documentation](#-api-documentation)
- [Machine Learning](#-machine-learning)
- [Database](#-database)
- [Tim Pengembang](#-tim-pengembang)

## ✨ Fitur Utama

### 1. Monitoring Kualitas Air

- Real-time monitoring 4 parameter utama:
  - **pH** (ideal: 6.5-8.5)
  - **Suhu** (ideal: 25-30°C)
  - **Kekeruhan/Turbidity** (ideal: <25 NTU)
  - **Oksigen Terlarut/DO** (ideal: >5 mg/L)
- Prediksi kualitas air menggunakan Machine Learning (Random Forest)
- Klasifikasi kondisi air: Baik, Normal, Perlu Perhatian
- Rekomendasi tindakan berdasarkan kondisi air

### 2. Manajemen Kolam

- Tambah, edit, dan hapus data kolam
- Monitoring per kolam
- Riwayat data sensor per kolam

### 3. Manajemen Pakan

- Jadwal pemberian pakan
- Tracking pakan per kolam
- Notifikasi jadwal pakan

### 4. E-Commerce

- Katalog produk (ikan nila, pakan, peralatan)
- Keranjang belanja
- Checkout dan pembayaran (integrasi Midtrans)
- Manajemen pesanan
- Riwayat pesanan

### 5. Manajemen Pengguna

- Role-based access control (Admin, Buyer, Petambak)
- Autentikasi dan otorisasi
- Reset password via email

## 🛠 Teknologi yang Digunakan

### Backend

- **Node.js** dengan **Express.js**
- **PostgreSQL** sebagai database
- **JWT** untuk autentikasi
- **bcrypt** untuk enkripsi password
- **Midtrans** untuk payment gateway
- **Nodemailer** untuk email service

### Frontend

- **React 18** dengan **Vite**
- **React Router** untuk routing
- **Tailwind CSS** untuk styling
- **Radix UI** untuk komponen UI
- **Recharts** untuk visualisasi data
- **Axios** untuk HTTP requests
- **Sonner** untuk notifications

### Machine Learning Service

- **Python 3.8+**
- **Flask** untuk API
- **scikit-learn** untuk ML model (Random Forest)
- **pandas** dan **numpy** untuk data processing
- **pydantic** untuk data validation

## 📁 Struktur Proyek

```
nilasense-react-express-aseli/
├── backend/                 # Express.js Backend API
│   ├── controllers/        # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & upload middleware
│   ├── services/          # External services (ML, Email)
│   ├── database/          # Database migrations & seeds
│   └── server.js          # Entry point
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── layouts/       # Layout components
│   └── package.json
│
└── ml-service/            # Flask ML Service
    ├── app/               # Flask application
    │   ├── routes.py      # API endpoints
    │   ├── predict.py     # Prediction logic
    │   └── validators.py  # Data validation
    ├── models/            # ML models
    │   ├── trained/       # Trained model files
    │   └── training/      # Training scripts
    ├── data/              # Datasets
    ├── notebooks/         # Jupyter notebooks
    ├── utils/             # Utilities
    └── requirements.txt   # Python dependencies
```

## 📦 Persyaratan Sistem

### Backend & Frontend

- Node.js >= 16.0.0
- npm >= 8.0.0
- PostgreSQL >= 12.0

### ML Service

- Python >= 3.8
- pip >= 20.0.0

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd nilasense-react-express-aseli
```

### 2. Setup Backend

```bash
cd backend
npm install

# Setup database
npm run db:setup-safe
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

### 4. Setup ML Service

```bash
cd ml-service

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Konfigurasi

### Backend (.env)

Buat file `.env` di folder `backend/`:

```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nilasense_db
DB_PASSWORD=your_password
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5001

# ML Service
ML_SERVICE_URL=http://localhost:5002
ML_SERVICE_ENABLED=true

# Email (untuk reset password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Midtrans (Payment Gateway)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false
```

### Frontend

Buat file `.env` di folder `frontend/` (opsional):

```env
VITE_API_URL=http://localhost:5001
VITE_ML_SERVICE_URL=http://localhost:5002
```

### ML Service (.env)

Buat file `.env` di folder `ml-service/`:

```env
FLASK_ENV=development
FLASK_PORT=5002
FLASK_DEBUG=True
```

## 🏃 Menjalankan Aplikasi

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Backend berjalan di `http://localhost:5001`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend berjalan di `http://localhost:5173`

**Terminal 3 - ML Service:**

```bash
cd ml-service
venv\Scripts\activate  # Windows
python run.py
```

ML Service berjalan di `http://localhost:5002`

### Production Mode

**Backend:**

```bash
cd backend
NODE_ENV=production npm start
```

**Frontend:**

```bash
cd frontend
npm run build
# Serve build folder dengan web server (nginx, apache, dll)
```

**ML Service:**

```bash
cd ml-service
gunicorn -w 4 -b 0.0.0.0:5002 run:app
```

## 📚 API Documentation

### Backend API Endpoints

#### Authentication

- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request reset password
- `POST /api/auth/reset-password` - Reset password

#### Monitoring

- `GET /api/monitoring/ponds/:pondId/logs` - Get logs kualitas air
- `POST /api/monitoring/logs` - Tambah log sensor baru
- `GET /api/monitoring/ponds/:pondId/latest` - Get data terbaru

#### Products

- `GET /api/products` - Get semua produk
- `GET /api/products/:id` - Get detail produk
- `POST /api/products` - Tambah produk (Admin)
- `PUT /api/products/:id` - Update produk (Admin)
- `DELETE /api/products/:id` - Hapus produk (Admin)

#### Orders

- `GET /api/orders` - Get semua pesanan
- `POST /api/orders` - Buat pesanan baru
- `GET /api/orders/:id` - Get detail pesanan
- `PUT /api/orders/:id/status` - Update status pesanan

#### Payments

- `POST /api/payments/create` - Buat payment token
- `POST /api/payments/notification` - Webhook Midtrans

### ML Service API Endpoints

#### Health Check

- `GET /api/health` - Check service status

#### Prediction

- `POST /api/predict` - Predict kualitas air (single)
- `POST /api/predict/batch` - Predict kualitas air (batch)

**Request Body:**

```json
{
  "ph": 7.2,
  "temperature": 28.5,
  "turbidity": 15.3,
  "dissolved_oxygen": 6.8
}
```

**Response:**

```json
{
  "success": true,
  "prediction": {
    "quality": "Baik",
    "confidence": 0.95,
    "description": "Kondisi air optimal untuk pertumbuhan ikan nila",
    "recommendations": ["Lanjutkan monitoring rutin"]
  }
}
```

## 🤖 Machine Learning

### Model Overview

Model menggunakan **Random Forest Classifier** untuk mengklasifikasikan kualitas air menjadi 3 kelas:

- **Baik** - Kondisi optimal untuk pertumbuhan ikan nila
- **Normal** - Kondisi masih layak namun perlu monitoring
- **Perlu Perhatian** - Kondisi berbahaya, perlu tindakan segera

### Features

Model menggunakan 4 parameter sensor sebagai input:

1. **pH** - Tingkat keasaman/basa air
2. **Temperature** - Suhu air dalam °C
3. **Turbidity** - Tingkat kekeruhan dalam NTU
4. **Dissolved Oxygen** - Kadar oksigen dalam mg/L

### Training Model

Untuk training model baru:

```bash
cd ml-service
python models/training/train_model.py
```

Atau gunakan Jupyter Notebook:

```bash
jupyter notebook notebooks/water_quality_model_training.ipynb
```

Model yang sudah ditraining akan disimpan di `ml-service/models/trained/`:

- `water_quality_rf_model.pkl` - Trained model
- `scaler.pkl` - StandardScaler untuk feature scaling
- `model_metadata.pkl` - Model metadata dan metrics

## 🗄️ Database

### Setup Database

```bash
cd backend
npm run db:setup-safe
```

### Database Schema

Tabel utama:

- `users` - Data pengguna (admin, buyer, petambak)
- `ponds` - Data kolam ikan
- `water_quality_logs` - Log data sensor kualitas air
- `feed_schedules` - Jadwal pemberian pakan
- `products` - Produk e-commerce
- `orders` - Pesanan
- `order_items` - Item pesanan

Untuk dokumentasi lengkap database, lihat `backend/database/README.md`

### Database Scripts

```bash
# Setup database (schema + data)
npm run db:setup

# Setup safe (data only, untuk database yang sudah ada)
npm run db:setup-safe

# Seed data
npm run db:seed

# Check status
npm run db:status
```

## 👥 Tim Pengembang

**Ahmad Faris AL Aziz** (J0404231081)

## 📝 License

Proyek ini dikembangkan untuk keperluan akademik.

## 🔗 Links

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`
- ML Service: `http://localhost:5002`

## 📞 Support

Jika ada pertanyaan atau masalah, silakan hubungi tim pengembang.

---

**Happy Coding! 🐟🤖**
