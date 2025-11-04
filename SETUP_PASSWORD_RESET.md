# Setup Password Reset Feature

## Overview

Fitur reset password telah diimplementasikan dengan lengkap, termasuk backend API dan frontend UI.

## Yang Sudah Diimplementasikan

### Backend

1. ✅ Migration untuk tabel `password_reset_tokens`
2. ✅ Service email dengan Nodemailer
3. ✅ Controller untuk forgot password dan reset password
4. ✅ Routes API: `/api/auth/forgot-password` dan `/api/auth/reset-password`

### Frontend

1. ✅ Halaman Lupa Password (`/lupa-password`)
2. ✅ Halaman Reset Password (`/reset-password?token=...`)
3. ✅ Integrasi dengan backend API

## Setup Database

Jalankan migration untuk membuat tabel password reset tokens:

```bash
cd backend
psql -U postgres -d nilasense_db -f database/migrations/008_add_password_reset.sql
```

Atau jika menggunakan database manager:

```bash
npm run db:manager
# Pilih opsi untuk menjalankan migration
```

## Konfigurasi Email (Opsional)

Untuk mengirim email secara nyata, Anda perlu mengonfigurasi email service di `backend/.env`:

### Opsi 1: SMTP Custom

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
FRONTEND_URL=http://localhost:5173
```

### Opsi 2: Gmail (Development)

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Cara mendapatkan Gmail App Password:**

1. Aktifkan 2-Step Verification di akun Google Anda
2. Buka https://myaccount.google.com/apppasswords
3. Generate App Password untuk "Mail"
4. Gunakan password tersebut di `GMAIL_APP_PASSWORD`

### Opsi 3: Simulasi (Development Mode)

Jika tidak mengonfigurasi email, sistem akan berjalan dalam **simulasi mode**:

- Token akan ditampilkan di console backend
- Email tidak akan benar-benar terkirim
- Cocok untuk development/testing

## Cara Menggunakan

### Untuk User:

1. Klik "Lupa Password?" di halaman login
2. Masukkan email yang terdaftar
3. Cek email (atau console backend jika mode simulasi)
4. Klik link reset password di email
5. Masukkan password baru
6. Login dengan password baru

### Testing (Development Mode):

1. Request reset password:

   ```bash
   POST http://localhost:5001/api/auth/forgot-password
   Body: { "email": "user@example.com" }
   ```

2. Cek console backend untuk token (jika mode simulasi)

3. Reset password:
   ```bash
   POST http://localhost:5001/api/auth/reset-password
   Body: {
     "token": "token-dari-console",
     "newPassword": "password-baru"
   }
   ```

## Security Features

1. ✅ Token di-hash sebelum disimpan ke database
2. ✅ Token kadaluarsa dalam 1 jam
3. ✅ Token hanya bisa digunakan sekali
4. ✅ Email enumeration protection (selalu return success message)
5. ✅ Password di-hash dengan bcrypt

## Catatan Penting

- **Development Mode**: Jika email tidak dikonfigurasi, sistem akan berjalan dalam mode simulasi
- **Production**: Pastikan mengonfigurasi SMTP/Gmail untuk mengirim email secara nyata
- **Token**: Token reset password hanya valid selama 1 jam
- **Security**: Jangan share token reset password dengan siapa pun

## Troubleshooting

### Email tidak terkirim

- Cek konfigurasi SMTP/Gmail di `.env`
- Cek console backend untuk error message
- Untuk development, gunakan mode simulasi (cek console untuk token)

### Token tidak valid

- Token mungkin sudah kadaluarsa (1 jam)
- Token mungkin sudah digunakan
- Request reset password baru

### Migration error

- Pastikan PostgreSQL berjalan
- Pastikan database `nilasense_db` sudah dibuat
- Cek error message di console

