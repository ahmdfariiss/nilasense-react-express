# 🚀 Panduan Lengkap Setup & Menjalankan Semua Services

## 📋 Checklist Prerequisites

- [x] Python 3.8+ (untuk ML Service) ✅
- [ ] Node.js 16+ (untuk Backend & Frontend)
- [ ] PostgreSQL (untuk Database)
- [ ] Git (opsional)

---

## 🎯 Urutan Setup & Menjalankan

### **1️⃣ ML Service (Port 5002) - ✅ SUDAH BERJALAN**

**Status:** ✅ Sudah berjalan di `http://localhost:5002`

**Jika belum running, jalankan:**

```bash
cd ml-service
venv\Scripts\activate
python run.py
```

**Verifikasi:** http://localhost:5002/api/health

---

### **2️⃣ Backend (Port 5001)**

#### **Setup Pertama Kali:**

```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies
npm install

# 3. Buat file .env
# Copy template di bawah dan simpan sebagai .env
```

#### **File Backend/.env:**

Buat file `backend/.env` dengan isi:

```env
# Server Configuration
PORT=5001

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nilasense_db
# Contoh:
# DATABASE_URL=postgresql://postgres:password123@localhost:5432/nilasense_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# ML Service Configuration
ML_SERVICE_URL=http://localhost:5002

# Midtrans Configuration (opsional - untuk payment)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

#### **Setup Database:**

```bash
# Pastikan PostgreSQL sudah berjalan
# Setup database (buat tabel, dll)
npm run db:setup-safe

# Atau jika ingin seed data awal
npm run db:setup-safe
npm run db:seed
```

#### **Menjalankan Backend:**

```bash
# Pastikan di folder backend
cd backend

# Jalankan server
npm start
```

**Backend akan berjalan di:** `http://localhost:5001`

**Verifikasi:**

- Browser: http://localhost:5001/
- API Test: http://localhost:5001/api/auth/login

---

### **3️⃣ Frontend (Port 5173)**

#### **Setup Pertama Kali:**

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install
```

#### **Konfigurasi Frontend:**

Frontend sudah dikonfigurasi untuk menggunakan:

- Backend API: `http://localhost:5001` ✅
- File: `frontend/src/services/api.js`

**Tidak perlu ubah apapun** jika port backend adalah 5001.

#### **Menjalankan Frontend:**

```bash
# Pastikan di folder frontend
cd frontend

# Jalankan development server
npm run dev
```

**Frontend akan berjalan di:** `http://localhost:5173`

**Verifikasi:** Browser akan otomatis terbuka di http://localhost:5173

---

## 🔄 Menjalankan Semua Services Sekaligus

### **Terminal 1 - ML Service:**

```bash
cd ml-service
venv\Scripts\activate
python run.py
```

**Status:** ✅ Running di port 5002

---

### **Terminal 2 - Backend:**

```bash
cd backend
npm start
```

**Status:** ✅ Running di port 5001

---

### **Terminal 3 - Frontend:**

```bash
cd frontend
npm run dev
```

**Status:** ✅ Running di port 5173

---

## ✅ Verifikasi Semua Services

### **Test ML Service:**

```bash
# Di terminal baru
curl http://localhost:5002/api/health
```

### **Test Backend:**

```bash
# Di terminal baru
curl http://localhost:5001/
```

### **Test Frontend:**

- Buka browser: http://localhost:5173
- Seharusnya halaman Welcome/Home muncul

---

## 🔍 Troubleshooting

### **Backend Error: Database Connection**

**Error:** `connect ECONNREFUSED` atau `relation does not exist`

**Solusi:**

1. Pastikan PostgreSQL berjalan
2. Cek `DATABASE_URL` di `.env` sudah benar
3. Jalankan: `npm run db:setup-safe`

### **Backend Error: ML Service Connection**

**Error:** `ML Service Error` atau `ECONNREFUSED`

**Solusi:**

1. Pastikan ML Service berjalan di port 5002
2. Cek `ML_SERVICE_URL=http://localhost:5002` di backend `.env`

### **Frontend Error: Cannot connect to Backend**

**Error:** `Network Error` atau `CORS error`

**Solusi:**

1. Pastikan Backend berjalan di port 5001
2. Cek browser console untuk error detail
3. Pastikan CORS sudah enable di backend (sudah ada di `server.js`)

### **Port Already in Use**

**Error:** `Port 5001 already in use`

**Solusi:**

```bash
# Windows - Cek port
netstat -ano | findstr :5001

# Matikan proses yang menggunakan port
# Atau ubah PORT di .env
```

---

## 📊 Port Summary

| Service    | Port | URL                   | Status |
| ---------- | ---- | --------------------- | ------ |
| ML Service | 5002 | http://localhost:5002 | ✅     |
| Backend    | 5001 | http://localhost:5001 | ⏳     |
| Frontend   | 5173 | http://localhost:5173 | ⏳     |

---

## 🎯 Quick Start Commands

### **Start Semua Services:**

```bash
# Terminal 1
cd ml-service && venv\Scripts\activate && python run.py

# Terminal 2
cd backend && npm start

# Terminal 3
cd frontend && npm run dev
```

---

## 📝 Checklist Final

- [ ] ML Service running (port 5002) ✅
- [ ] PostgreSQL running
- [ ] Backend `.env` file dibuat
- [ ] Database setup (`npm run db:setup-safe`)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend running (port 5001)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running (port 5173)
- [ ] Semua service dapat diakses
- [ ] Frontend dapat connect ke Backend
- [ ] Backend dapat connect ke ML Service

---

## 🌐 Akses Aplikasi

Setelah semua service berjalan:

**Frontend (Main App):**

- URL: http://localhost:5173
- Default akan redirect ke Welcome/Home page

**Backend API:**

- Root: http://localhost:5001
- API Base: http://localhost:5001/api

**ML Service:**

- Health: http://localhost:5002/api/health
- Predict: http://localhost:5002/api/predict

---

**Selamat! Semua service siap digunakan! 🎉**
