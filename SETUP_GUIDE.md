# 🚀 Setup Guide - NilaSense CRUD Product & User Management

## ⚠️ Langkah-langkah Setup Backend & Frontend

### 1️⃣ **Setup Backend**

```bash
# Masuk ke folder backend
cd backend

# Install dependencies jika belum
npm install

# Pastikan database PostgreSQL sudah running
# Cek file .env untuk konfigurasi database

# Jalankan backend server
npm start
# atau
node server.js
```

**Backend harus berjalan di:** `http://localhost:5001`

---

### 2️⃣ **Setup Frontend**

```bash
# Masuk ke folder frontend (dari root project)
cd frontend

# Install dependencies jika belum
npm install

# Jalankan development server
npm run dev
```

**Frontend akan berjalan di:** `http://localhost:5173` (atau port lain yang ditampilkan)

---

## 🔐 **Login sebagai Admin**

Untuk mengakses halaman **Product Management** dan **User Management**, Anda harus login sebagai **Admin**.

### Credentials Admin Default:
```
Email: admin@example.com
Password: admin123
```

*(Pastikan user admin ini ada di database Anda)*

---

## 📍 **URL Halaman Management**

Setelah login sebagai admin, akses:

- **Product Management:** `http://localhost:5173/product-management`
- **User Management:** `http://localhost:5173/user-management`
- **Feed Management:** `http://localhost:5173/feed-management`
- **Admin Dashboard:** `http://localhost:5173/admin-dashboard`

---

## 🧪 **Testing CRUD Operations**

### ✅ **Test Product Management:**

1. Login sebagai admin
2. Navigasi ke `/product-management`
3. Klik "Tambah Produk"
4. Isi form:
   - Nama: "Test Nila Premium"
   - Harga: 50000
   - Stok: 100
   - Kategori: Ikan Konsumsi
   - URL Gambar: (opsional)
5. Klik "Tambah"
6. Produk akan muncul di tabel
7. Test Edit & Delete

### ✅ **Test User Management:**

1. Login sebagai admin
2. Navigasi ke `/user-management`
3. Klik "Tambah User"
4. Isi form:
   - Nama: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
   - Role: Pembeli atau Administrator
5. Klik "Tambah"
6. User akan muncul di tabel
7. Test Edit & Delete

---

## 🐛 **Troubleshooting**

### ❌ **CRUD tidak berjalan? Cek ini:**

#### 1. **Backend tidak running:**
```bash
cd backend
npm start
```
Pastikan ada output: `Server berjalan di port 5001`

#### 2. **Database tidak terkoneksi:**
Cek file `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=nilasense_db
```

Test koneksi database:
```bash
cd backend
node -e "const db = require('./db'); db.query('SELECT NOW()').then(r => console.log('DB OK:', r.rows[0])).catch(e => console.error('DB Error:', e.message));"
```

#### 3. **Frontend tidak bisa fetch data:**

Buka Browser Console (F12) dan lihat error. Kemungkinan:

- **CORS Error:** Backend harus allow `http://localhost:5173`
- **Network Error:** Backend tidak running
- **401 Unauthorized:** Token expired, login ulang

#### 4. **Token expired / 401 error:**

Logout dan login kembali. Token JWT memiliki expired time.

#### 5. **Port conflict:**

Jika port 5001 atau 5173 sudah dipakai:

**Backend:** Edit `backend/server.js` atau `backend/.env`
```javascript
const PORT = process.env.PORT || 5002; // ganti port
```

**Frontend:** Edit `frontend/vite.config.ts`
```javascript
export default defineConfig({
  server: {
    port: 5174 // ganti port
  }
})
```

---

## 📊 **API Endpoints Reference**

### **Products API:**
```
GET    /api/products           - Get all products (public)
GET    /api/products/:id       - Get single product (public)
POST   /api/products           - Create product (admin only)
PUT    /api/products/:id       - Update product (admin only)
DELETE /api/products/:id       - Delete product (admin only)
```

### **Users API:**
```
GET    /api/users              - Get all users (admin only)
GET    /api/users/:id          - Get single user (admin only)
POST   /api/users              - Create user (admin only)
PUT    /api/users/:id          - Update user (admin only)
DELETE /api/users/:id          - Delete user (admin only)
```

### **Test dengan cURL:**

**Get all products:**
```bash
curl http://localhost:5001/api/products
```

**Create product (need admin token):**
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Nila Test",
    "description": "Test product",
    "price": 50000,
    "stock_kg": 100,
    "category": "Ikan Konsumsi"
  }'
```

---

## 🔑 **Cara Mendapatkan Token untuk Testing:**

1. Login via API:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

2. Response akan berisi `token`, copy token tersebut
3. Gunakan token di header: `Authorization: Bearer TOKEN_ANDA`

---

## ✅ **Checklist Verifikasi:**

- [ ] Backend running di port 5001
- [ ] Frontend running di port 5173
- [ ] Database PostgreSQL terkoneksi
- [ ] Bisa login sebagai admin
- [ ] Halaman `/product-management` terbuka
- [ ] Halaman `/user-management` terbuka
- [ ] Bisa Create produk baru
- [ ] Bisa Edit produk
- [ ] Bisa Delete produk
- [ ] Bisa Create user baru
- [ ] Bisa Edit user
- [ ] Bisa Delete user

---

## 📝 **Catatan Penting:**

1. **Semua operasi CRUD Product & User hanya bisa dilakukan oleh ADMIN**
2. **Token JWT diperlukan untuk operasi admin**
3. **Token disimpan otomatis di localStorage setelah login**
4. **Jika logout, token akan dihapus**
5. **Backend harus running sebelum frontend bisa fetch data**

---

## 🆘 **Masih Error?**

Kirim screenshot error dari:
1. Browser Console (F12 → Console tab)
2. Network tab (F12 → Network tab) - lihat failed requests
3. Backend terminal log

Dengan informasi ini, masalah bisa diidentifikasi dengan cepat! 🚀
