# Panduan Menjalankan NilaSense Services

Panduan ini menjelaskan cara menjalankan ML Service, Backend, dan Frontend secara bersamaan.

## 📋 Prerequisites

1. **Python 3.8+** (untuk ML Service)
2. **Node.js 16+** (untuk Backend & Frontend)
3. **PostgreSQL** (untuk Database)
4. **Virtual Environment** untuk Python (opsional tapi direkomendasikan)

---

## 🚀 Cara Menjalankan Services

### **1. ML Service (Flask) - Port 5002**

#### Setup Pertama Kali:

```bash
# 1. Masuk ke folder ml-service
cd ml-service

# 2. Buat virtual environment (jika belum ada)
python -m venv venv

# 3. Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Pastikan model sudah ada di models/trained/
# Jika belum, jalankan training notebook terlebih dahulu
```

#### Menjalankan ML Service:

```bash
# Pastikan virtual environment sudah aktif
# Windows:
venv\Scripts\activate

# Jalankan service
python run.py
```

**ML Service akan berjalan di: `http://localhost:5002`**

✅ Verifikasi: Buka browser dan akses `http://localhost:5002/api/health`

---

### **2. Backend (Express.js) - Port 5001**

#### Setup Pertama Kali:

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Setup database (jika belum)
npm run db:setup-safe

# 4. Setup environment variables
# Buat file .env dengan isi:
# PORT=5001
# DATABASE_URL=postgresql://username:password@localhost:5432/nilasense_db
# JWT_SECRET=your-secret-key
# ML_SERVICE_URL=http://localhost:5000
```

#### Menjalankan Backend:

```bash
# Pastikan berada di folder backend
cd backend

# Jalankan server
npm start
# atau
npm run start
```

**Backend akan berjalan di: `http://localhost:5001`**

✅ Verifikasi: Buka browser dan akses `http://localhost:5001/`

---

### **3. Frontend (React + Vite) - Port 5173**

#### Setup Pertama Kali:

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install
```

#### Menjalankan Frontend:

```bash
# Pastikan berada di folder frontend
cd frontend

# Jalankan development server
npm run dev
```

**Frontend akan berjalan di: `http://localhost:5173`**

✅ Verifikasi: Buka browser dan akses `http://localhost:5173`

---

## 🔄 Menjalankan Semua Services Sekaligus

### **Metode 1: Terminal Terpisah (Recommended)**

Buka **3 terminal terpisah** dan jalankan masing-masing service:

**Terminal 1 - ML Service:**

```bash
cd ml-service
venv\Scripts\activate  # Windows
python run.py
```

**Terminal 2 - Backend:**

```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**

```bash
cd frontend
npm run dev
```

### **Metode 2: Menggunakan npm-run-all (Opsional)**

Jika ingin menjalankan dari satu command, install `npm-run-all`:

```bash
# Di root project, install npm-run-all
npm install --save-dev npm-run-all

# Buat script di root package.json:
# {
#   "scripts": {
#     "dev:ml": "cd ml-service && venv\\Scripts\\activate && python run.py",
#     "dev:backend": "cd backend && npm start",
#     "dev:frontend": "cd frontend && npm run dev",
#     "dev": "npm-run-all --parallel dev:ml dev:backend dev:frontend"
#   }
# }
```

---

## ⚙️ Environment Variables

### **Backend (.env):**

```env
# Server
PORT=5001

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/nilasense_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# ML Service
ML_SERVICE_URL=http://localhost:5002

# Midtrans (jika menggunakan payment)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

### **ML Service (.env):**

```env
# Flask
FLASK_ENV=development
FLASK_PORT=5000
FLASK_DEBUG=true

# Model Paths
MODEL_PATH=models/trained/water_quality_rf_model.pkl
SCALER_PATH=models/trained/scaler.pkl

# Backend Integration
BACKEND_API_URL=http://localhost:5001

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🔍 Troubleshooting

### **1. ML Service tidak bisa diakses dari Backend**

- Pastikan ML Service berjalan di port 5002
- Cek `ML_SERVICE_URL=http://localhost:5002` di backend `.env`
- Pastikan tidak ada firewall yang memblokir koneksi

### **2. Backend tidak bisa connect ke Database**

- Pastikan PostgreSQL berjalan
- Cek `DATABASE_URL` di backend `.env`
- Pastikan database sudah dibuat: `npm run db:setup-safe`

### **3. Frontend tidak bisa connect ke Backend**

- Pastikan Backend berjalan di port 5001
- Cek `api.js` di frontend untuk base URL
- Pastikan CORS di backend sudah dikonfigurasi dengan benar

### **4. ML Model tidak ditemukan**

- Pastikan model sudah di-train dan ada di `ml-service/models/trained/`
- File yang diperlukan:
  - `water_quality_rf_model.pkl`
  - `scaler.pkl`
  - `model_metadata.pkl`

### **5. Port sudah digunakan**

- **Port 5002** (ML Service): `netstat -ano | findstr :5002` (Windows)
- **Port 5001** (Backend): `netstat -ano | findstr :5001` (Windows)
- **Port 5173** (Frontend): `netstat -ano | findstr :5173` (Windows)

Gunakan port lain atau hentikan proses yang menggunakan port tersebut.

---

## ✅ Checklist Startup

Sebelum mulai development, pastikan:

- [ ] PostgreSQL sudah berjalan
- [ ] Database sudah dibuat dan di-migrate
- [ ] ML Service berjalan di port 5002
- [ ] Backend berjalan di port 5001
- [ ] Frontend berjalan di port 5173
- [ ] Environment variables sudah dikonfigurasi
- [ ] ML Model sudah ada dan bisa di-load

---

## 📝 Urutan Startup yang Direkomendasikan

1. **Start PostgreSQL** (jika belum running)
2. **Start ML Service** → `http://localhost:5002`
3. **Start Backend** → `http://localhost:5001`
4. **Start Frontend** → `http://localhost:5173`

---

## 🌐 Akses Aplikasi

Setelah semua service berjalan:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **ML Service**: http://localhost:5002
- **ML Health Check**: http://localhost:5002/api/health

---

## 💡 Tips

1. **Gunakan terminal/console terpisah** untuk setiap service agar mudah melihat log masing-masing
2. **Jangan tutup terminal** saat development, biarkan service tetap berjalan
3. **Hot reload** sudah aktif untuk Backend (nodemon) dan Frontend (Vite)
4. **ML Service** perlu di-restart manual jika ada perubahan di model atau kode Python

---

**Selamat Development! 🎉**
