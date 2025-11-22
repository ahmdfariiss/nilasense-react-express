# NilaSense Deployment Guide

Panduan lengkap untuk deploy NilaSense ke production menggunakan:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)
- **ML Service**: Render

---

## Daftar Isi

1. [Arsitektur Deployment](#1-arsitektur-deployment)
2. [Persiapan Awal](#2-persiapan-awal)
3. [Setup Database (Supabase)](#3-setup-database-supabase)
4. [Deploy Backend (Render)](#4-deploy-backend-render)
5. [Deploy ML Service (Render)](#5-deploy-ml-service-render)
6. [Deploy Frontend (Vercel)](#6-deploy-frontend-vercel)
7. [Konfigurasi Environment Variables](#7-konfigurasi-environment-variables)
8. [Post-Deployment Testing](#8-post-deployment-testing)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Arsitektur Deployment

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Frontend       │────▶│  Backend        │────▶│  Database       │
│  (Vercel)       │     │  (Render)       │     │  (Supabase)     │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │  ML Service     │
                        │  (Render)       │
                        │                 │
                        └─────────────────┘
```

**URL Production (contoh):**
- Frontend: `https://nilasense.vercel.app`
- Backend: `https://nilasense-backend.onrender.com`
- ML Service: `https://nilasense-ml.onrender.com`

---

## 2. Persiapan Awal

### 2.1 Buat Akun di Platform

1. **Vercel**: https://vercel.com (login dengan GitHub)
2. **Render**: https://render.com (login dengan GitHub)
3. **Supabase**: https://supabase.com (login dengan GitHub)

### 2.2 Push Code ke GitHub

Pastikan repository sudah di-push ke GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.3 Struktur Folder yang Diperlukan

```
nilasense-react-express-aseli/
├── frontend/          # React + Vite
├── backend/           # Express.js
├── ml-service/        # Flask + ML
└── DEPLOYMENT.md      # File ini
```

---

## 3. Setup Database (Supabase)

### 3.1 Buat Project Baru

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik **"New Project"**
3. Isi detail:
   - **Name**: `nilasense-db`
   - **Database Password**: (simpan password ini!)
   - **Region**: Pilih yang terdekat (Singapore)
4. Klik **"Create new project"**

### 3.2 Dapatkan Connection String

1. Buka **Project Settings** → **Database**
2. Scroll ke **Connection string** → **URI**
3. Copy connection string, formatnya:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### 3.3 Jalankan Migration

Ada 2 cara untuk menjalankan migration:

#### Cara 1: Via Supabase SQL Editor (Recommended)

1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan migration secara berurutan:

```sql
-- ================================================
-- 001_initial_schema.sql
-- ================================================

-- Buat enum untuk role user
CREATE TYPE user_role AS ENUM ('admin', 'petambak', 'buyer');

-- Tabel Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'buyer',
    pond_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Ponds (Kolam)
CREATE TABLE ponds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    size_m2 DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Water Quality Monitoring
CREATE TABLE water_quality (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),
    ph_level DECIMAL(4,2),
    dissolved_oxygen DECIMAL(5,2),
    turbidity DECIMAL(6,2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_kg DECIMAL(10,2) NOT NULL,
    stock_kg DECIMAL(10,2) DEFAULT 0,
    image_url VARCHAR(500),
    pond_id INTEGER REFERENCES ponds(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Feed Schedules
CREATE TABLE feed_schedules (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    feed_time TIME NOT NULL,
    feed_amount_kg DECIMAL(6,2) NOT NULL,
    feed_type VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Feed Logs
CREATE TABLE feed_logs (
    id SERIAL PRIMARY KEY,
    pond_id INTEGER REFERENCES ponds(id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES feed_schedules(id),
    fed_at TIMESTAMPTZ DEFAULT NOW(),
    amount_kg DECIMAL(6,2),
    fed_by INTEGER REFERENCES users(id),
    notes TEXT
);

-- Tabel Cart
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity_kg DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Tabel Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_name VARCHAR(255),
    shipping_phone VARCHAR(20),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_postal_code VARCHAR(10),
    notes TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    midtrans_order_id VARCHAR(100),
    midtrans_transaction_id VARCHAR(100),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255),
    quantity_kg DECIMAL(10,2) NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL
);

-- Tabel Password Reset Tokens
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_water_quality_pond ON water_quality(pond_id);
CREATE INDEX idx_water_quality_recorded ON water_quality(recorded_at);
CREATE INDEX idx_products_pond ON products(pond_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin NilaSense', 'admin@nilasense.com', '$2b$10$rICvqo5gPDsxPmNVHliMOuGPmhHqZxepeS/VISBCgVqd6pVqvQjku', 'admin');

-- Insert sample pond
INSERT INTO ponds (name, location, description, size_m2) VALUES
('Kolam Utama', 'Bogor, Jawa Barat', 'Kolam budidaya ikan nila utama', 500);
```

#### Cara 2: Via Terminal (jika PostgreSQL client terinstall)

```bash
# Export connection string
export DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Jalankan migration
psql $DATABASE_URL -f backend/database/migrations/001_initial_schema.sql
```

---

## 4. Deploy Backend (Render)

### 4.1 Buat Web Service Baru

1. Login ke [Render Dashboard](https://dashboard.render.com)
2. Klik **"New +"** → **"Web Service"**
3. Connect repository GitHub Anda
4. Pilih repository `nilasense-react-express-aseli`

### 4.2 Konfigurasi Service

| Setting | Value |
|---------|-------|
| **Name** | `nilasense-backend` |
| **Region** | Singapore (Southeast Asia) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |

### 4.3 Environment Variables

Tambahkan environment variables berikut di Render:

```env
# Database (dari Supabase)
DB_USER=postgres
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_DATABASE=postgres
DB_PASSWORD=your_supabase_password
DB_PORT=6543

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# ML Service (setelah deploy)
ML_SERVICE_URL=https://nilasense-ml.onrender.com

# Midtrans (Payment Gateway)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

# Email (Gmail SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Frontend URL (untuk CORS)
FRONTEND_URL=https://nilasense.vercel.app

# Node Environment
NODE_ENV=production
```

### 4.4 Deploy

1. Klik **"Create Web Service"**
2. Tunggu build selesai (5-10 menit)
3. Catat URL backend: `https://nilasense-backend.onrender.com`

---

## 5. Deploy ML Service (Render)

### 5.1 Buat Web Service Baru

1. Di Render Dashboard, klik **"New +"** → **"Web Service"**
2. Connect repository yang sama
3. Konfigurasi:

| Setting | Value |
|---------|-------|
| **Name** | `nilasense-ml` |
| **Region** | Singapore |
| **Branch** | `main` |
| **Root Directory** | `ml-service` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn --bind 0.0.0.0:$PORT run:app` |
| **Instance Type** | Free |

### 5.2 Environment Variables

```env
FLASK_ENV=production
FLASK_PORT=5002
PYTHONUNBUFFERED=1
```

### 5.3 Update requirements.txt untuk Production

Pastikan `requirements.txt` sudah include gunicorn:

```txt
gunicorn>=21.2.0
```

### 5.4 Deploy

1. Klik **"Create Web Service"**
2. Tunggu build selesai
3. Catat URL: `https://nilasense-ml.onrender.com`

### 5.5 Update Backend ML_SERVICE_URL

Setelah ML Service deploy, update environment variable di Backend:

```env
ML_SERVICE_URL=https://nilasense-ml.onrender.com
```

---

## 6. Deploy Frontend (Vercel)

### 6.1 Import Project

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"Add New..."** → **"Project"**
3. Import repository dari GitHub
4. Pilih `nilasense-react-express-aseli`

### 6.2 Konfigurasi Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 6.3 Environment Variables

```env
VITE_API_URL=https://nilasense-backend.onrender.com/api
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

### 6.4 Update api.js untuk Production

Edit `frontend/src/services/api.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// ... rest of the code
```

### 6.5 Deploy

1. Klik **"Deploy"**
2. Tunggu build selesai (2-5 menit)
3. Catat URL: `https://nilasense.vercel.app`

---

## 7. Konfigurasi Environment Variables

### 7.1 Summary Environment Variables

#### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_USER` | Database user | `postgres` |
| `DB_HOST` | Supabase host | `aws-0-ap-southeast-1.pooler.supabase.com` |
| `DB_DATABASE` | Database name | `postgres` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_PORT` | Database port | `6543` |
| `JWT_SECRET` | JWT secret key | `min_32_characters_secret` |
| `ML_SERVICE_URL` | ML service URL | `https://nilasense-ml.onrender.com` |
| `MIDTRANS_SERVER_KEY` | Midtrans server key | `Mid-server-xxx` |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key | `Mid-client-xxx` |
| `MIDTRANS_IS_PRODUCTION` | Production mode | `false` |
| `GMAIL_USER` | Gmail address | `email@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | Frontend URL (CORS) | `https://nilasense.vercel.app` |
| `NODE_ENV` | Environment | `production` |

#### ML Service (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_ENV` | Environment | `production` |
| `FLASK_PORT` | Port | `5002` |
| `PYTHONUNBUFFERED` | Python output | `1` |

#### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://nilasense-backend.onrender.com/api` |
| `VITE_MIDTRANS_CLIENT_KEY` | Midtrans client key | `Mid-client-xxx` |

---

## 8. Post-Deployment Testing

### 8.1 Test Backend API

```bash
# Health check
curl https://nilasense-backend.onrender.com/

# Expected response:
# {"message":"Selamat datang di NilaSense Backend API!"}
```

### 8.2 Test ML Service

```bash
# Health check
curl https://nilasense-ml.onrender.com/health

# Expected response:
# {"status":"healthy","model_loaded":true}
```

### 8.3 Test Frontend

1. Buka `https://nilasense.vercel.app`
2. Coba login dengan:
   - Email: `admin@nilasense.com`
   - Password: `admin123`

### 8.4 Full Integration Test

1. Register user baru
2. Login
3. Lihat produk
4. Tambah ke keranjang
5. Checkout
6. Cek monitoring dashboard

---

## 9. Troubleshooting

### 9.1 Backend tidak bisa connect ke database

**Gejala**: Error `ECONNREFUSED` atau `connection timeout`

**Solusi**:
1. Pastikan connection string benar
2. Gunakan **pooler connection** dari Supabase (port 6543)
3. Cek apakah IP Render perlu di-whitelist

### 9.2 CORS Error di Frontend

**Gejala**: `Access-Control-Allow-Origin` error

**Solusi**:
1. Pastikan `FRONTEND_URL` di backend sudah benar
2. Update `corsOptions` di `server.js`:

```javascript
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    /\.vercel\.app$/,
  ],
  credentials: true,
};
```

### 9.3 ML Service crash on Render

**Gejala**: Service keeps restarting

**Solusi**:
1. Cek logs di Render dashboard
2. Pastikan `gunicorn` ada di `requirements.txt`
3. Gunakan command: `gunicorn --bind 0.0.0.0:$PORT run:app`

### 9.4 Build gagal di Vercel

**Gejala**: Build error

**Solusi**:
1. Pastikan `Root Directory` = `frontend`
2. Cek apakah ada error di `package.json`
3. Clear cache dan redeploy

### 9.5 JWT Token Error

**Gejala**: `jwt malformed` atau `invalid signature`

**Solusi**:
1. Pastikan `JWT_SECRET` sama di semua environment
2. Clear localStorage di browser
3. Login ulang

### 9.6 Render Free Tier Sleep

**Gejala**: First request sangat lambat (15-30 detik)

**Penjelasan**: Free tier Render akan sleep setelah 15 menit tidak ada aktivitas.

**Solusi**:
1. Upgrade ke paid tier, atau
2. Setup uptime monitoring (UptimeRobot) untuk ping setiap 10 menit

---

## Quick Reference

### URLs

| Service | URL |
|---------|-----|
| Frontend | `https://nilasense.vercel.app` |
| Backend | `https://nilasense-backend.onrender.com` |
| ML Service | `https://nilasense-ml.onrender.com` |
| Database | Supabase Dashboard |

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@nilasense.com` | `admin123` |

### Useful Commands

```bash
# Check backend health
curl https://nilasense-backend.onrender.com/

# Check ML health
curl https://nilasense-ml.onrender.com/health

# Test login API
curl -X POST https://nilasense-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nilasense.com","password":"admin123"}'
```

---

## Support

Jika mengalami masalah:
1. Cek logs di masing-masing platform
2. Pastikan semua environment variables sudah di-set
3. Cek network tab di browser untuk error details

**Last Updated**: November 2024
