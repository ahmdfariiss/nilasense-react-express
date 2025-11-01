# 🔧 Setup File .env untuk Backend

## ❌ Masalah: Password Database Tidak Terdeteksi

Error yang muncul:

```
SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

Ini terjadi karena file `.env` belum dibuat atau password database tidak di-set.

## ✅ Solusi: Buat File .env

### Langkah 1: Buat file `backend/.env`

Buat file baru dengan nama `.env` di folder `backend/` dengan isi:

```env
# Server Configuration
PORT=5001

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nilasense_db
DB_PASSWORD=password_anda_disini
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-12345

# ML Service Configuration
ML_SERVICE_URL=http://localhost:5002

# Midtrans Configuration (opsional)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

### Langkah 2: Ganti Password Database

**PENTING:** Ganti `password_anda_disini` dengan password PostgreSQL Anda.

**Contoh:**

- Jika password PostgreSQL Anda adalah `admin123`, maka:

  ```env
  DB_PASSWORD=admin123
  ```

- Jika password PostgreSQL Anda adalah `postgres`, maka:

  ```env
  DB_PASSWORD=postgres
  ```

- Jika password PostgreSQL Anda kosong/tidak ada, biarkan kosong:
  ```env
  DB_PASSWORD=
  ```

### Langkah 3: Cek Password PostgreSQL Anda

Jika lupa password PostgreSQL:

**Windows:**

1. Buka `pgAdmin` atau
2. Cek file `pg_hba.conf` atau
3. Reset password melalui Windows Services

**Atau test connection:**

```bash
# Coba connect dengan psql
psql -U postgres -h localhost
# Akan minta password
```

### Langkah 4: Jalankan Setup Database Lagi

Setelah file `.env` dibuat dengan benar:

```bash
cd backend
npm run db:setup-safe
```

## 📝 Template Lengkap

Copy template ini dan simpan sebagai `backend/.env`:

```env
PORT=5001

DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nilasense_db
DB_PASSWORD=
DB_PORT=5432

JWT_SECRET=my-super-secret-jwt-key-2024
ML_SERVICE_URL=http://localhost:5002
```

**Jangan lupa ganti:**

- `DB_PASSWORD=` dengan password PostgreSQL Anda
- `JWT_SECRET=` dengan secret key yang aman

## 🔍 Troubleshooting

### Password Kosong

Jika password PostgreSQL Anda kosong:

```env
DB_PASSWORD=
```

Jangan hapus barisnya, biarkan kosong setelah `=`.

### Password dengan Karakter Khusus

Jika password mengandung karakter khusus seperti `@`, `#`, `$`, dll:

```env
DB_PASSWORD=my@pass#word
```

Tidak perlu di-escape, langsung tulis saja.

### Port PostgreSQL Bukan 5432

Jika port PostgreSQL Anda berbeda (misalnya 5433):

```env
DB_PORT=5433
```

