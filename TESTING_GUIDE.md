# 🧪 PANDUAN TESTING CRUD OPERATIONS

## 📋 Persiapan Testing

### 1. Pastikan Server Backend Berjalan

```bash
cd backend
npm start
```

Server harus running di: `http://localhost:5001`

### 2. Pastikan Frontend Berjalan

```bash
cd frontend
npm run dev
```

Frontend harus running di: `http://localhost:5173` (atau port yang ditampilkan)

### 3. Login sebagai Admin

- Email: `admin@example.com` (atau sesuai data di database)
- Password: password admin Anda

---

## 🎯 TEST SCENARIO 1: POND MANAGEMENT (Kolam)

### ✅ Test Create Pond

1. Login sebagai Admin
2. Navigasi ke **"Manajemen Kolam"** dari sidebar
3. Klik tombol **"Tambah Kolam"**
4. Isi form:
   ```
   Nama Kolam: Kolam Test A
   Lokasi: Blok Utara
   Deskripsi: Kolam untuk testing fitur CRUD
   ```
5. Klik **"Tambah"**
6. **Expected:** Toast success muncul, kolam baru tampil di table

### ✅ Test Read/View Ponds

1. Di halaman Manajemen Kolam
2. **Expected:**
   - Semua kolam ditampilkan di table
   - Statistics cards menampilkan data yang benar
   - Search box berfungsi untuk filter kolam

### ✅ Test Edit Pond

1. Klik tombol **Edit** (icon pensil) pada kolam yang baru dibuat
2. Ubah data:
   ```
   Nama Kolam: Kolam Test A - Edited
   Deskripsi: Deskripsi sudah diubah
   ```
3. Klik **"Perbarui"**
4. **Expected:**
   - Toast success muncul
   - Data kolam terupdate di table
   - Deskripsi tersimpan dengan benar ✨

### ✅ Test Delete Pond

1. Klik tombol **Delete** (icon trash) pada kolam test
2. Confirmation dialog muncul
3. Klik **"Hapus"**
4. **Expected:**
   - Toast success muncul
   - Kolam hilang dari table
   - Statistics cards updated

### 🔍 Verification

Cek database langsung:

```sql
SELECT * FROM ponds ORDER BY created_at DESC LIMIT 5;
```

Pastikan field `description` tersimpan dengan benar!

---

## 🍽️ TEST SCENARIO 2: FEED MANAGEMENT (Pakan)

### ✅ Test Create Feed Schedule

1. Navigasi ke **"Manajemen Pakan"**
2. Klik **"Tambah Jadwal"**
3. Isi form:
   ```
   Kolam: [Pilih kolam yang ada]
   Tanggal: [Today]
   Waktu Pemberian: 08:00
   Jumlah (kg): 5
   Jenis Pakan: Pelet Protein Tinggi
   ```
4. Klik **"Tambah"**
5. **Expected:**
   - Toast success muncul
   - Jadwal baru tampil di table
   - Status: "Menunggu"

### ✅ Test Edit Feed Schedule

1. Klik tombol **Edit** pada jadwal
2. Ubah jumlah pakan menjadi `7 kg`
3. Klik **"Perbarui"**
4. **Expected:** Data terupdate

### ✅ Test Mark as Completed

1. Klik icon **CheckCircle** (✓) di kolom Aksi
2. **Expected:**
   - Status berubah menjadi "Selesai"
   - Badge berubah warna jadi hijau

### ✅ Test Mark as Pending

1. Pada jadwal yang sudah "Selesai", klik icon **Play** (▶)
2. **Expected:** Status kembali ke "Menunggu"

### ✅ Test Delete Feed Schedule

1. Klik tombol **Delete** (icon trash)
2. Konfirmasi di dialog
3. **Expected:** Jadwal terhapus

### ✅ Test Filter & Search

1. **Filter by Pond:** Pilih kolam tertentu dari dropdown
2. **Filter by Date:** Pilih tanggal berbeda
3. **Search:** Ketik jenis pakan
4. **Expected:** Table ter-filter dengan benar

### 🔍 Test Feed Summary (User Access)

1. **Logout** dari admin
2. **Login** sebagai buyer/user
3. Navigasi ke **"Dashboard Monitoring"** > **"Jadwal Pakan"**
4. **Expected:**
   - User bisa melihat jadwal pakan ✨ (route `/accessible/:pondId` sudah fixed)
   - Summary card menampilkan data yang benar
   - Next feed time tampil dengan benar

---

## 📦 TEST SCENARIO 3: PRODUCT MANAGEMENT

### ✅ Test Create Product

1. Login sebagai Admin
2. Navigasi ke **"Manajemen Produk"**
3. Klik **"Tambah Produk"**
4. Isi form:
   ```
   Nama Produk: Nila Test Premium
   Deskripsi: Produk untuk testing
   Harga (Rp/kg): 55000
   Stok (kg): 100
   Kategori: Ikan Konsumsi
   URL Gambar: https://picsum.photos/400
   ```
5. Klik **"Tambah"**
6. **Expected:**
   - Produk muncul di table
   - Statistics cards updated
   - Image preview tampil (atau fallback icon)

### ✅ Test Edit Product

1. Klik tombol **Edit**
2. Ubah harga menjadi `60000`
3. Ubah stok menjadi `50`
4. Klik **"Perbarui"**
5. **Expected:** Semua perubahan tersimpan

### ✅ Test Delete Product

1. Klik tombol **Delete**
2. Konfirmasi deletion
3. **Expected:** Produk terhapus dari database

### ✅ Test Public Access

1. **Logout**
2. Buka halaman **"Pasar Ikan Nila"** (tanpa login)
3. **Expected:**
   - Produk tampil untuk public
   - Product detail bisa dibuka
   - WhatsApp order link berfungsi

---

## 👥 TEST SCENARIO 4: USER MANAGEMENT

### ✅ Test Create User

1. Login sebagai Admin
2. Navigasi ke **"Manajemen User"**
3. Klik **"Tambah User"**
4. Isi form:
   ```
   Nama Lengkap: Test User
   Email: testuser@example.com
   Password: password123
   Role: Pembeli
   ```
5. Klik **"Tambah"**
6. **Expected:**
   - User baru muncul di table
   - Statistics updated

### ✅ Test Edit User (Without Password Change)

1. Klik **Edit** pada user
2. Ubah nama menjadi `Test User - Edited`
3. **Kosongkan field password**
4. Klik **"Perbarui"**
5. **Expected:**
   - Nama terupdate
   - Password TIDAK berubah (user masih bisa login dengan password lama) ✨

### ✅ Test Edit User (With Password Change)

1. Klik **Edit** pada user
2. Isi password baru: `newpassword123`
3. Klik **"Perbarui"**
4. **Expected:**
   - Password terupdate
   - User harus login dengan password baru

### ✅ Test Change User Role

1. Edit user dengan role "Pembeli"
2. Ubah role menjadi "Administrator"
3. Klik **"Perbarui"**
4. **Expected:**
   - Role berubah
   - Badge di table updated

### ✅ Test Delete User

1. Klik **Delete** pada test user
2. Konfirmasi deletion
3. **Expected:** User terhapus

### ✅ Test Email Uniqueness

1. Coba buat user dengan email yang sudah ada
2. **Expected:** Error message "Email sudah digunakan"

---

## 💧 TEST SCENARIO 5: WATER MONITORING

### ✅ Test Add Manual Log (Admin)

1. Login sebagai Admin
2. Navigasi ke **"Monitoring Air"**
3. Pilih kolam dari dropdown
4. Klik **"Tambah Data Manual"**
5. Isi form:
   ```
   Suhu (°C): 28
   pH: 7.2
   Oksigen (mg/L): 6.5
   Kekeruhan (NTU): 15
   ```
6. Klik **"Simpan"**
7. **Expected:**
   - Data muncul di table
   - Charts updated dengan data baru ✨
   - Current status cards updated

### ✅ Test View Historical Data

1. Di halaman Monitoring Air
2. Pilih time range: "7 Hari"
3. **Expected:**
   - Charts menampilkan trend 7 hari
   - Table menampilkan history data

### ✅ Test Export CSV

1. Klik **"Export CSV"**
2. **Expected:**
   - File CSV terdownload
   - Berisi data: Tanggal, Waktu, Suhu, pH, Oksigen, Kekeruhan

### ✅ Test Pond Selection

1. Ganti kolam dari dropdown
2. **Expected:**
   - Data reload untuk kolam yang dipilih
   - Charts dan table updated

### ✅ Test User Access

1. **Logout** dan **Login** sebagai buyer
2. Navigasi ke **"Dashboard Monitoring"** > **"Monitoring Kualitas Air"**
3. **Expected:**
   - User bisa melihat data monitoring
   - Charts tampil dengan data real ✨
   - Empty state jika belum ada data

---

## 📊 TEST SCENARIO 6: ADMIN DASHBOARD INTEGRATION

### ✅ Test Real-time Data Display

1. Login sebagai Admin
2. Buka **"Dashboard"**
3. Pilih kolam dari dropdown
4. **Expected:**
   - **Status Kualitas Air:** Menampilkan status real dari data terbaru ✨
   - **Jadwal Pakan Berikutnya:** Menampilkan jadwal real dari feed schedules ✨
   - **Stok Produk:** Menampilkan total stok dari products ✨
   - **Chart Tren 24 Jam:** Menampilkan data real monitoring ✨

### ✅ Test Refresh Functionality

1. Klik tombol **"Refresh"**
2. **Expected:**
   - Semua data reload
   - Loading spinner muncul saat refresh

### ✅ Test Pond Switch

1. Ganti pond dari dropdown
2. **Expected:**
   - Data water quality updated untuk pond baru
   - Chart tren updated
   - Feed schedule updated

### ✅ Test AI Predictions/Trend Analysis

1. Lihat card **"Analisis Tren Kualitas Air"**
2. **Expected:**
   - Prediksi based on real data trends ✨
   - Status: "Baik" atau "Perhatian"
   - Trend indicators (up/down/stable)

---

## 🔐 TEST SCENARIO 7: AUTHORIZATION & PERMISSIONS

### ✅ Test Admin-Only Access

1. Login sebagai **Buyer/User**
2. Coba akses URL langsung:
   - `/admin-dashboard`
   - `/pond-management`
   - `/product-management`
   - `/user-management`
3. **Expected:** Redirect ke dashboard user dengan error toast

### ✅ Test Protected Routes

1. **Logout**
2. Coba akses URL protected pages
3. **Expected:** Redirect ke login page

### ✅ Test Role-based Features

**As Admin:**

- ✅ Bisa CRUD semua resource
- ✅ Bisa add manual water logs
- ✅ Bisa manage feed schedules

**As Buyer:**

- ✅ Bisa view monitoring data
- ✅ Bisa mark feed schedules as completed
- ❌ TIDAK bisa create/delete resources

---

## 📝 VALIDATION TESTING

### Form Validation Tests

#### Pond Form:

- [ ] Nama kolam < 3 karakter → Error
- [ ] Lokasi < 3 karakter → Error
- [ ] Deskripsi kosong → OK (optional)

#### Feed Schedule Form:

- [ ] Kolam tidak dipilih → Error
- [ ] Waktu kosong → Error
- [ ] Jumlah = 0 → Error
- [ ] Jumlah > 100 → Error

#### Product Form:

- [ ] Nama < 3 karakter → Error
- [ ] Harga ≤ 0 → Error
- [ ] Stok < 0 → Error

#### User Form:

- [ ] Nama < 3 karakter → Error
- [ ] Email invalid format → Error
- [ ] Password < 6 karakter → Error (saat create)
- [ ] Role tidak dipilih → Error

#### Water Monitoring Form:

- [ ] Suhu < 0 atau > 50 → Error
- [ ] pH < 0 atau > 14 → Error
- [ ] Oksigen < 0 → Error
- [ ] Kekeruhan < 0 → Error

---

## 🐛 ERROR HANDLING TESTING

### Test Error Responses

1. **Network Error:**

   - Stop backend server
   - Coba create/edit resource
   - **Expected:** Toast error "Gagal..."

2. **Duplicate Email (User):**

   - Create user dengan email existing
   - **Expected:** Toast "Email sudah digunakan"

3. **404 Not Found:**

   - Edit/Delete resource yang sudah dihapus
   - **Expected:** Toast error appropriate

4. **Unauthorized:**
   - Token expired/invalid
   - **Expected:** Redirect to login

---

## ✅ FINAL CHECKLIST

### Backend Verification

- [ ] Server running without errors
- [ ] All routes responding correctly
- [ ] Database connections stable
- [ ] No console errors

### Frontend Verification

- [ ] All pages load without errors
- [ ] No console errors/warnings
- [ ] Loading states display correctly
- [ ] Toast notifications work
- [ ] Forms validate correctly

### Integration Verification

- [ ] ✅ Pond description field saves correctly
- [ ] ✅ Feed accessible routes work for buyers
- [ ] ✅ Feed summary endpoint accessible
- [ ] ✅ Product CRUD complete
- [ ] ✅ User CRUD complete
- [ ] ✅ Water monitoring logs save
- [ ] ✅ Admin dashboard shows real data
- [ ] ✅ All charts display real data

### Data Persistence

- [ ] Data survives server restart
- [ ] Foreign key constraints work
- [ ] Cascade delete works (if implemented)
- [ ] Timestamps (created_at) save correctly

---

## 🎉 SUCCESS CRITERIA

Jika semua test di atas ✅ PASS, maka:

**CRUD Operations: 100% WORKING** ✨

**Production Ready:** YES 🚀

**Next Steps:**

1. Deploy to staging/production
2. User acceptance testing (UAT)
3. Performance testing dengan data lebih banyak

---

Dibuat pada: 2025-01-23
Status: ✅ **READY FOR COMPREHENSIVE TESTING**
