# 🔧 Troubleshooting CRUD Product & User Management

## 🚨 Masalah: CRUD tidak berjalan

Ikuti checklist ini secara berurutan:

---

## ✅ **STEP 1: Verifikasi Backend Running**

### Cek apakah backend berjalan:

```bash
# Terminal 1 - Jalankan backend
cd backend
npm start
```

**Harus muncul:**
```
Server berjalan di port 5001
```

### Test backend API:
```bash
curl http://localhost:5001/
```

**Expected response:**
```json
{"message":"Selamat datang di NilaSense Backend API!"}
```

❌ **Jika error:**
- Port 5001 sudah dipakai? Ganti port di `backend/server.js`
- Dependencies belum terinstall? Jalankan `npm install`

---

## ✅ **STEP 2: Verifikasi Database Connection**

### Test database:
```bash
cd backend
node -e "const db = require('./db'); db.query('SELECT NOW()').then(r => console.log('✅ DB Connected:', r.rows[0].now)).catch(e => console.error('❌ DB Error:', e.message));"
```

**Expected output:**
```
✅ DB Connected: 2025-10-19T...
```

❌ **Jika error:**

Cek file `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=nilasense_db
```

Pastikan PostgreSQL running:
```bash
# Linux/Mac
pg_isready

# Windows
pg_ctl status
```

---

## ✅ **STEP 3: Verifikasi Frontend Running**

```bash
# Terminal 2 - Jalankan frontend
cd frontend
npm run dev
```

**Harus muncul:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Buka browser: `http://localhost:5173`

---

## ✅ **STEP 4: Login sebagai Admin**

1. Buka `http://localhost:5173/login`
2. Login dengan credentials admin:
   ```
   Email: admin@example.com
   Password: admin123
   ```

❌ **Jika user admin tidak ada:**

Buat user admin di database:
```sql
INSERT INTO users (name, email, password, role) 
VALUES (
  'Admin User', 
  'admin@example.com', 
  '$2a$10$YourHashedPasswordHere', -- hashed 'admin123'
  'admin'
);
```

Atau gunakan script seed jika ada.

---

## ✅ **STEP 5: Test Access Management Pages**

Setelah login sebagai admin:

### Test Product Management:
1. Navigasi ke: `http://localhost:5173/product-management`
2. **Jika muncul halaman dengan tabel → BERHASIL ✅**
3. **Jika redirect atau error → LIHAT BROWSER CONSOLE**

### Test User Management:
1. Navigasi ke: `http://localhost:5173/user-management`
2. **Jika muncul halaman dengan tabel → BERHASIL ✅**
3. **Jika redirect atau error → LIHAT BROWSER CONSOLE**

---

## ✅ **STEP 6: Debug dengan Browser Console**

### Buka Browser Console (F12):

#### Network Tab:
1. Refresh halaman `/product-management`
2. Lihat request ke `/api/products`
3. Check response:

**✅ Status 200 → API working**
```json
[
  {
    "id": 1,
    "name": "Nila Premium",
    "price": 50000,
    ...
  }
]
```

**❌ Status 401 Unauthorized:**
```json
{"message": "Token tidak valid"}
```
→ **Solusi:** Logout dan login kembali

**❌ Status 500 Internal Server Error:**
```json
{"message": "Terjadi kesalahan pada server"}
```
→ **Solusi:** Cek backend terminal untuk error log

**❌ Failed to fetch / CORS error:**
```
Access to fetch at 'http://localhost:5001/api/products' from origin 'http://localhost:5173' has been blocked by CORS
```
→ **Solusi:** Backend `server.js` harus punya:
```javascript
const cors = require("cors");
app.use(cors());
```

#### Console Tab:
Lihat error messages di console. Common errors:

**❌ "Cannot read property 'map' of undefined"**
→ Data belum loaded, tambahkan loading state check

**❌ "Network Error"**
→ Backend tidak running atau port salah

---

## ✅ **STEP 7: Test CRUD Operations**

### Test CREATE Product:

1. Klik "Tambah Produk"
2. Isi form:
   ```
   Nama: Test Product
   Harga: 50000
   Stok: 100
   Kategori: Ikan Konsumsi
   ```
3. Klik "Tambah"

**Expected:** Toast success + produk muncul di tabel

**Debug jika error:**
- Buka Network tab, lihat POST request ke `/api/products`
- Cek request payload dan response
- Cek backend console untuk error

### Test UPDATE Product:

1. Klik icon Edit pada produk
2. Ubah nama menjadi "Test Product Updated"
3. Klik "Perbarui"

**Expected:** Toast success + nama berubah di tabel

### Test DELETE Product:

1. Klik icon Delete pada produk
2. Konfirmasi delete
3. **Expected:** Toast success + produk hilang dari tabel

---

## 🔍 **Common Issues & Solutions**

### Issue 1: "Token tidak valid" / 401 Error

**Penyebab:** Token JWT expired atau tidak ada

**Solusi:**
1. Logout
2. Login kembali
3. Token baru akan disimpan di localStorage

**Manual check token:**
```javascript
// Di browser console
localStorage.getItem('token')
```
Jika null atau undefined, login ulang.

---

### Issue 2: Data tidak muncul (tabel kosong)

**Penyebab:** Backend tidak return data atau data belum ada

**Debug:**
```bash
# Test API langsung
curl http://localhost:5001/api/products
```

**Jika response `[]`** → Database kosong, tambah data manual:
```sql
INSERT INTO products (user_id, name, description, price, stock_kg, category) 
VALUES (1, 'Nila Premium', 'Ikan nila berkualitas', 50000, 100, 'Ikan Konsumsi');
```

---

### Issue 3: Create/Update tidak berfungsi

**Penyebab:** Backend controller error atau validasi gagal

**Debug:**
1. Buka Network tab
2. Lihat request payload:
```json
{
  "name": "Test",
  "price": 50000,
  "stock_kg": 100,
  "category": "Ikan Konsumsi"
}
```
3. Lihat response error message
4. Cek backend terminal untuk stack trace

**Common backend errors:**
- Missing fields → Cek validasi di controller
- Database constraint error → Cek schema
- Type mismatch → Pastikan number dikirim sebagai number, bukan string

---

### Issue 4: Authorization error untuk admin

**Penyebab:** User role bukan 'admin'

**Check user role:**
```sql
SELECT id, name, email, role FROM users WHERE email = 'admin@example.com';
```

**Jika role = 'buyer', update:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

### Issue 5: CORS Error

**Error message:**
```
Access to fetch at 'http://localhost:5001/api/...' has been blocked by CORS policy
```

**Solusi:** Tambahkan di `backend/server.js`:
```javascript
const cors = require("cors");

// Specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Atau allow all
app.use(cors());
```

Restart backend setelah perubahan.

---

## 🧪 **Manual API Testing dengan cURL**

### Get Products:
```bash
curl http://localhost:5001/api/products
```

### Login & Get Token:
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq .token
```

Copy token dari response.

### Create Product (with token):
```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test",
    "price": 50000,
    "stock_kg": 100,
    "category": "Ikan Konsumsi"
  }'
```

### Update Product:
```bash
curl -X PUT http://localhost:5001/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Product",
    "price": 60000
  }'
```

### Delete Product:
```bash
curl -X DELETE http://localhost:5001/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 **Final Checklist**

Jika semua langkah di atas sudah diikuti:

- [x] Backend running ✅
- [x] Database connected ✅
- [x] Frontend running ✅
- [x] Login sebagai admin berhasil ✅
- [x] Token tersimpan di localStorage ✅
- [x] Halaman management terbuka ✅
- [x] Data muncul di tabel ✅
- [x] Create berfungsi ✅
- [x] Update berfungsi ✅
- [x] Delete berfungsi ✅

**Jika semua checklist ✅ tapi masih error:**

Kirimkan informasi berikut:
1. Screenshot error dari Browser Console
2. Screenshot Network tab (failed request)
3. Backend terminal log
4. Langkah yang sudah dicoba

---

## 🆘 **Quick Fix Commands**

```bash
# Restart semua
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev

# Terminal 3 - Test
curl http://localhost:5001/
curl http://localhost:5001/api/products
```

---

Good luck! 🚀
