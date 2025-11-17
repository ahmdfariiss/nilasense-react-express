# 🚀 Panduan Deployment NilaSense

Dokumentasi lengkap untuk deployment aplikasi NilaSense (Frontend, Backend, dan ML Service) menggunakan platform gratis.

---

## 📋 Daftar Isi

1. [Arsitektur Aplikasi](#arsitektur-aplikasi)
2. [Platform Deployment Gratis](#platform-deployment-gratis)
3. [Persiapan Sebelum Deploy](#persiapan-sebelum-deploy)
4. [Deployment Frontend (React + Vite)](#deployment-frontend-react--vite)
5. [Deployment Backend (Express.js)](#deployment-backend-expressjs)
6. [Deployment ML Service (Flask)](#deployment-ml-service-flask)
7. [Deployment Database (PostgreSQL)](#deployment-database-postgresql)
8. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
9. [Testing Setelah Deploy](#testing-setelah-deploy)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arsitektur Aplikasi

NilaSense terdiri dari 3 service utama:

```
┌─────────────────┐
│    Frontend     │ (React + Vite)
│  Vercel/Netlify │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Backend      │ (Express.js + PostgreSQL)
│   Render.com    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ML Service    │ (Flask + scikit-learn)
│   Render.com    │
└─────────────────┘
```

---

## 🎯 Platform Deployment Gratis

### Rekomendasi Platform:

| Service | Platform | Alasan | Limit Gratis |
|---------|----------|--------|--------------|
| **Frontend** | Vercel | Build otomatis, CDN global, unlimited bandwidth | Unlimited projects, 100GB bandwidth/bulan |
| **Backend** | Render.com | Support PostgreSQL, free SSL, auto-deploy dari Git | 750 jam/bulan, sleep after 15 min inactive |
| **ML Service** | Render.com | Support Python/Flask, persistent storage | 750 jam/bulan, sleep after 15 min inactive |
| **Database** | Supabase / Render PostgreSQL | Free PostgreSQL dengan UI admin | 500MB storage (Supabase), 1GB (Render) |

### Alternatif Platform:

- **Frontend**: Netlify, GitHub Pages, Cloudflare Pages
- **Backend**: Railway, Fly.io, Cyclic
- **ML Service**: PythonAnywhere, Heroku (limited free tier)
- **Database**: ElephantSQL, Neon.tech, Railway PostgreSQL

---

## ⚙️ Persiapan Sebelum Deploy

### 1. Push Code ke GitHub

```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "Prepare for deployment"

# Buat repository di GitHub, lalu:
git remote add origin https://github.com/username/nilasense.git
git branch -M main
git push -u origin main
```

### 2. Cek Dependencies

Pastikan semua file berikut ada:

**Frontend:**
- ✅ `frontend/package.json`
- ✅ `frontend/vite.config.js`
- ✅ `frontend/.env.example`

**Backend:**
- ✅ `backend/package.json`
- ✅ `backend/server.js`
- ✅ `backend/.env.example`

**ML Service:**
- ✅ `ml-service/requirements.txt`
- ✅ `ml-service/run.py`
- ✅ `ml-service/.env.example`

### 3. Test Local

```bash
# Test frontend
cd frontend
npm run build
npm run preview

# Test backend
cd ../backend
npm start

# Test ML service
cd ../ml-service
python run.py
```

---

## 🎨 Deployment Frontend (React + Vite)

### Menggunakan Vercel (Recommended)

#### Langkah 1: Persiapan

1. Buat file `vercel.json` di folder `frontend/`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "vite"
}
```

2. Update `frontend/package.json` pastikan ada:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### Langkah 2: Deploy ke Vercel

**Opsi A: Via Web Dashboard**

1. Buka [vercel.com](https://vercel.com)
2. Sign up/Login dengan GitHub
3. Klik "Add New Project"
4. Import repository NilaSense
5. Konfigurasi:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Tambahkan Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   VITE_ML_API_URL=https://your-ml-service.onrender.com
   ```
7. Klik "Deploy"

**Opsi B: Via CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? nilasense-frontend
# - Directory? ./
# - Override settings? No
```

#### Langkah 3: Konfigurasi Domain

Setelah deploy, Vercel akan memberikan URL seperti:
```
https://nilasense-frontend-xxxxx.vercel.app
```

**Custom Domain (Opsional):**
1. Buka Project Settings > Domains
2. Tambahkan domain custom
3. Update DNS sesuai instruksi Vercel

---

### Menggunakan Netlify (Alternatif)

#### Langkah 1: Persiapan

Buat file `netlify.toml` di folder `frontend/`:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### Langkah 2: Deploy

1. Buka [netlify.com](https://netlify.com)
2. Sign up/Login
3. "Add new site" > "Import an existing project"
4. Connect GitHub repository
5. Konfigurasi:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Tambahkan Environment Variables di Site settings
7. Deploy

---

## 🔧 Deployment Backend (Express.js)

### Menggunakan Render.com (Recommended)

#### Langkah 1: Persiapan

1. Pastikan `backend/package.json` memiliki:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

2. Buat file `render.yaml` di root project (opsional):

```yaml
services:
  - type: web
    name: nilasense-backend
    env: node
    region: singapore
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
```

#### Langkah 2: Setup Database di Render

1. Login ke [render.com](https://render.com)
2. Dashboard > "New" > "PostgreSQL"
3. Konfigurasi:
   - **Name**: nilasense-db
   - **Database**: nilasense_prod
   - **User**: (auto-generated)
   - **Region**: Singapore
   - **Plan**: Free
4. Klik "Create Database"
5. **Simpan credentials** yang diberikan:
   ```
   Internal Database URL: postgresql://...
   External Database URL: postgresql://...
   ```

#### Langkah 3: Deploy Backend ke Render

1. Dashboard > "New" > "Web Service"
2. Connect GitHub repository
3. Konfigurasi:
   - **Name**: nilasense-backend
   - **Region**: Singapore
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. **Environment Variables** (klik "Advanced"):
   ```
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=<paste-internal-database-url>
   JWT_SECRET=<generate-random-secret-key>
   MIDTRANS_SERVER_KEY=<your-midtrans-server-key>
   MIDTRANS_CLIENT_KEY=<your-midtrans-client-key>
   FRONTEND_URL=https://nilasense-frontend.vercel.app
   ML_API_URL=https://nilasense-ml.onrender.com
   ```

5. Klik "Create Web Service"

#### Langkah 4: Inisialisasi Database

Setelah backend deploy:

1. Buka Render Shell (di dashboard service)
2. Jalankan migrasi:
   ```bash
   cd backend
   npm run migrate
   # atau
   node scripts/migrate.js
   ```

**ATAU** menggunakan Render PostgreSQL dashboard:
1. Buka database dashboard
2. Tab "Connect" > "SQL Editor"
3. Paste isi file `backend/migrations/*.sql` dan execute

---

### Menggunakan Railway (Alternatif)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inisialisasi
cd backend
railway init

# Deploy
railway up

# Add PostgreSQL
railway add --database postgres

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secret-key
```

---

## 🤖 Deployment ML Service (Flask)

### Menggunakan Render.com

#### Langkah 1: Persiapan

1. Pastikan `ml-service/requirements.txt` lengkap:

```txt
Flask==3.0.0
flask-cors==4.0.0
python-dotenv==1.0.0
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
joblib==1.3.2
gunicorn==21.2.0
```

2. Buat file `ml-service/gunicorn_config.py`:

```python
import os

bind = f"0.0.0.0:{os.environ.get('PORT', '5002')}"
workers = 2
threads = 2
timeout = 120
worker_class = 'sync'
```

3. Update `ml-service/run.py` untuk production:

```python
import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    # Development
    if os.environ.get('FLASK_ENV') == 'development':
        app.run(host='0.0.0.0', port=port, debug=True)
    # Production
    else:
        app.run(host='0.0.0.0', port=port, debug=False)
```

#### Langkah 2: Deploy ke Render

1. Dashboard > "New" > "Web Service"
2. Connect repository
3. Konfigurasi:
   - **Name**: nilasense-ml
   - **Region**: Singapore
   - **Root Directory**: `ml-service`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --config gunicorn_config.py run:app`
   - **Plan**: Free
4. **Environment Variables**:
   ```
   FLASK_ENV=production
   PORT=5002
   BACKEND_URL=https://nilasense-backend.onrender.com
   ```
5. Klik "Create Web Service"

#### Langkah 3: Test ML Service

Setelah deploy, test endpoint:

```bash
curl https://nilasense-ml.onrender.com/health

# Response:
# {"status": "healthy", "service": "ML Service"}
```

---

### Menggunakan PythonAnywhere (Alternatif)

1. Buka [pythonanywhere.com](https://www.pythonanywhere.com)
2. Sign up untuk free account
3. Upload code via Git atau Files
4. Setup Web App:
   - Python version: 3.10
   - Framework: Flask
   - WSGI configuration: edit untuk point ke `run:app`
5. Install dependencies di Bash console:
   ```bash
   pip install -r requirements.txt
   ```
6. Reload web app

---

## 💾 Deployment Database (PostgreSQL)

### Opsi 1: Supabase (Recommended untuk Development)

**Keunggulan:**
- Free 500MB storage
- Admin dashboard dengan SQL editor
- Real-time subscriptions
- Auto-backup
- Tidak sleep

**Langkah:**

1. Buka [supabase.com](https://supabase.com)
2. "New Project"
3. Konfigurasi:
   - **Name**: nilasense-db
   - **Database Password**: (generate strong password)
   - **Region**: Southeast Asia (Singapore)
   - **Pricing Plan**: Free
4. Tunggu ~2 menit untuk provisioning
5. Buka "Settings" > "Database"
6. Copy **Connection String**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
7. Gunakan SQL Editor untuk run migrasi

**Migration via Supabase:**
```sql
-- Paste isi file backend/migrations/*.sql di SQL Editor
-- Execute satu per satu
```

---

### Opsi 2: Render PostgreSQL

**Keunggulan:**
- Terintegrasi dengan Render services
- Free 1GB storage
- Auto-backup

**Kelemahan:**
- Database akan dihapus setelah 90 hari (free tier)

**Langkah:**
1. Render Dashboard > "New" > "PostgreSQL"
2. Konfigurasi database (sudah dijelaskan di bagian Backend)
3. Gunakan Internal Database URL untuk backend di Render
4. Gunakan External Database URL untuk akses lokal

---

### Opsi 3: ElephantSQL

**Keunggulan:**
- Free 20MB storage
- Dedicated database
- Web SQL browser

**Langkah:**
1. Buka [elephantsql.com](https://www.elephantsql.com)
2. Sign up > "Create New Instance"
3. Plan: Tiny Turtle (Free)
4. Region: Asia Pacific (Singapore)
5. Copy URL: `postgresql://...`
6. Gunakan Browser untuk run migrations

---

## 🔐 Konfigurasi Environment Variables

### Frontend (.env.production)

Buat di Vercel/Netlify dashboard:

```env
VITE_API_URL=https://nilasense-backend.onrender.com
VITE_ML_API_URL=https://nilasense-ml.onrender.com
```

### Backend (.env)

Buat di Render dashboard:

```env
# Server
NODE_ENV=production
PORT=5001

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# CORS
FRONTEND_URL=https://nilasense-frontend.vercel.app

# Midtrans (Payment Gateway)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false

# ML Service
ML_API_URL=https://nilasense-ml.onrender.com

# Upload (Opsional - jika pakai cloud storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### ML Service (.env)

Buat di Render dashboard:

```env
FLASK_ENV=production
PORT=5002
BACKEND_URL=https://nilasense-backend.onrender.com
```

---

## 🔄 Update CORS di Backend

Update `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'https://nilasense-frontend.vercel.app', // Production frontend
    'https://nilasense-frontend-*.vercel.app', // Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## ✅ Testing Setelah Deploy

### 1. Test Frontend

```bash
# Buka di browser
https://nilasense-frontend.vercel.app

# Test navigasi:
- Homepage ✓
- Login ✓
- Register ✓
- Products ✓
- Cart ✓
- Checkout ✓
```

### 2. Test Backend API

```bash
# Health check
curl https://nilasense-backend.onrender.com/health

# Test login
curl -X POST https://nilasense-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test get products
curl https://nilasense-backend.onrender.com/api/products
```

### 3. Test ML Service

```bash
# Health check
curl https://nilasense-ml.onrender.com/health

# Test prediction
curl -X POST https://nilasense-ml.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{"temperature":28,"ph":7.5,"dissolved_oxygen":6.5,"ammonia":0.5}'
```

### 4. Test End-to-End Flow

1. **Register User**
   - Buka frontend
   - Register akun baru
   - Cek email konfirmasi (jika ada)

2. **Login**
   - Login dengan akun yang dibuat
   - Cek token tersimpan

3. **Browse Products**
   - Lihat daftar produk
   - Cek gambar loading

4. **Add to Cart**
   - Tambahkan produk ke cart
   - Cek cart count

5. **Checkout**
   - Proses checkout
   - Test payment gateway (Midtrans sandbox)

6. **Admin Dashboard** (jika login sebagai admin)
   - Lihat dashboard
   - Test CRUD operations
   - Test ML prediction

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem: Build failed**
```
Error: Could not resolve dependencies
```
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem: API calls failing (CORS error)**
```
Access to fetch blocked by CORS policy
```
**Solution:**
- Cek VITE_API_URL di environment variables Vercel
- Pastikan backend CORS origin include frontend URL
- Clear cache dan hard reload browser

**Problem: 404 on page refresh**
```
Cannot GET /products
```
**Solution:**
- Pastikan `vercel.json` ada dengan rewrites
- Atau tambahkan di Netlify: `_redirects` file:
  ```
  /*    /index.html   200
  ```

---

### Backend Issues

**Problem: Database connection failed**
```
Error: connect ETIMEDOUT
```
**Solution:**
- Cek DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Gunakan Internal Database URL jika di Render
- Test koneksi:
  ```javascript
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
  });
  ```

**Problem: JWT verification failed**
```
Error: jwt malformed
```
**Solution:**
- Pastikan JWT_SECRET sama panjangnya (min 32 char)
- Generate baru:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

**Problem: File upload not working**
```
Error: ENOENT no such file or directory
```
**Solution:**
- Render free tier tidak support persistent storage
- Gunakan Cloudinary untuk upload:
  ```bash
  npm install cloudinary multer-storage-cloudinary
  ```

**Problem: Service sleeping (cold start)**
```
Request timeout after 30s
```
**Solution:**
- Render free tier sleeps after 15 min inactivity
- Opsi 1: Upgrade ke paid plan ($7/month)
- Opsi 2: Gunakan cron job untuk ping:
  ```yaml
  # render.yaml
  services:
    - type: cron
      name: keep-alive
      schedule: "*/10 * * * *"  # Every 10 minutes
      command: curl https://nilasense-backend.onrender.com/health
  ```
- Opsi 3: Gunakan uptime monitoring (UptimeRobot, Pingdom)

---

### ML Service Issues

**Problem: Model file not found**
```
FileNotFoundError: model.pkl not found
```
**Solution:**
- Pastikan model.pkl di-commit ke Git
- Atau train model saat startup:
  ```python
  import os
  if not os.path.exists('models/model.pkl'):
      train_and_save_model()
  ```

**Problem: Memory limit exceeded**
```
Error: Container killed (OOM)
```
**Solution:**
- Render free tier: 512MB RAM
- Optimize model:
  ```python
  # Gunakan model lebih ringan
  from sklearn.ensemble import RandomForestClassifier
  model = RandomForestClassifier(n_estimators=50)  # Reduce from 100
  ```
- Atau gunakan model pre-trained lebih kecil

**Problem: Slow predictions**
```
Request timeout
```
**Solution:**
- Cache predictions:
  ```python
  from functools import lru_cache

  @lru_cache(maxsize=100)
  def predict_cached(temp, ph, do, ammonia):
      return model.predict([[temp, ph, do, ammonia]])
  ```

---

### Database Issues

**Problem: Migration failed**
```
ERROR: relation already exists
```
**Solution:**
```sql
-- Drop existing tables (HATI-HATI!)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
-- Re-run migrations
```

**Problem: Connection pool exhausted**
```
Error: too many clients
```
**Solution:**
```javascript
// backend/config/database.js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5, // Limit untuk free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## 📊 Monitoring & Logs

### Render Logs

```bash
# Via Dashboard
1. Buka service
2. Tab "Logs"
3. Real-time streaming

# Via CLI
render logs -s nilasense-backend
render logs -s nilasense-ml
```

### Vercel Logs

```bash
# Via CLI
vercel logs

# Via Dashboard
Project > Deployments > Click deployment > Logs
```

### Database Monitoring

**Supabase:**
- Dashboard > Database > Logs
- Real-time query performance

**Render PostgreSQL:**
- Dashboard > Database > Metrics
- Connection count, CPU, Memory

---

## 🔄 Auto-Deploy dari Git

### Vercel
✅ Auto-deploy enabled by default
- Push ke `main` → Auto deploy
- Push ke branch → Preview deploy

### Render
✅ Auto-deploy enabled by default
- Push ke `main` → Auto deploy
- Manual deploy juga available

**Disable auto-deploy:**
```
Settings > Build & Deploy > Auto-Deploy: Off
```

---

## 💰 Estimasi Biaya

### Free Tier Limits

| Service | Platform | Free Limit | Setelah Limit |
|---------|----------|------------|---------------|
| Frontend | Vercel | 100GB bandwidth/month | $20/month untuk 1TB |
| Backend | Render | 750 hours/month, sleeps after 15 min | $7/month untuk always on |
| ML Service | Render | 750 hours/month | $7/month |
| Database | Supabase | 500MB storage, 2GB bandwidth | $25/month |
| Database | Render | 1GB storage, 90 days retention | $7/month untuk persistent |

**Total Gratis:** ✅ $0/month (dengan batasan)
**Total Jika Upgrade:** ~$25-40/month untuk always-on services

---

## 🎓 Best Practices

### 1. Environment Variables
- ❌ Jangan commit `.env` files
- ✅ Gunakan `.env.example` sebagai template
- ✅ Rotate secrets secara berkala
- ✅ Gunakan secrets manager untuk production

### 2. Database
- ✅ Selalu backup database
- ✅ Gunakan migrations untuk schema changes
- ✅ Index kolom yang sering di-query
- ✅ Monitor connection pool

### 3. Security
- ✅ Gunakan HTTPS (auto di semua platform)
- ✅ Enable CORS dengan origin spesifik
- ✅ Rate limiting untuk API
- ✅ Sanitize user input
- ✅ Gunakan prepared statements (prevent SQL injection)

### 4. Performance
- ✅ Enable gzip compression
- ✅ Cache static assets
- ✅ Optimize images (use CDN)
- ✅ Lazy load components di frontend
- ✅ Database query optimization

### 5. Monitoring
- ✅ Setup error tracking (Sentry)
- ✅ Monitor uptime (UptimeRobot)
- ✅ Track performance metrics
- ✅ Setup alerts untuk downtime

---

## 📚 Resources

### Platform Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)

### Tutorials
- [Deploy React to Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [Deploy Express to Render](https://render.com/docs/deploy-node-express-app)
- [Deploy Flask to Render](https://render.com/docs/deploy-flask)

### Community
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Render Community](https://community.render.com)
- [Stack Overflow](https://stackoverflow.com)

---

## 🆘 Bantuan Lebih Lanjut

Jika mengalami masalah:

1. **Cek Logs** - 90% masalah terlihat di logs
2. **Cek Environment Variables** - Pastikan semua var terkonfigurasi
3. **Test Local** - Reproduce issue di local environment
4. **Baca Dokumentasi** - Platform docs sangat lengkap
5. **Google Error Message** - Biasanya sudah ada solusinya
6. **Ask Community** - Discord/Forum platform

---

## ✨ Checklist Deployment

### Pre-Deployment
- [ ] Code di-push ke GitHub
- [ ] Dependencies up-to-date
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Local testing passed
- [ ] Build locally successful

### Frontend Deployment
- [ ] Deploy ke Vercel/Netlify
- [ ] Environment variables configured
- [ ] Custom domain setup (opsional)
- [ ] Test semua pages load
- [ ] Test API calls work

### Backend Deployment
- [ ] Database created & configured
- [ ] Database migrations executed
- [ ] Backend deployed ke Render
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Test all endpoints

### ML Service Deployment
- [ ] ML service deployed ke Render
- [ ] Model files uploaded/trained
- [ ] Environment variables configured
- [ ] Test prediction endpoints

### Post-Deployment
- [ ] End-to-end testing
- [ ] Monitor logs for errors
- [ ] Setup uptime monitoring
- [ ] Document deployment URLs
- [ ] Share with team/users

---

**🎉 Selamat! Aplikasi NilaSense sudah berhasil di-deploy!**

Untuk update selanjutnya, cukup push ke GitHub dan deployment akan otomatis.

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

---

**Dibuat untuk NilaSense Project**
_Marketplace Ikan Nila Premium Berbasis Teknologi IoT & AI_
