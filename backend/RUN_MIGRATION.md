# Cara Menjalankan Migration Password Reset

Error 500 terjadi karena tabel `password_reset_tokens` belum dibuat di database.

## Solusi Cepat:

### Opsi 1: Auto-create (Sudah ditambahkan)

Tabel akan otomatis dibuat saat pertama kali digunakan. Coba lagi request forgot password.

### Opsi 2: Manual Migration (Disarankan)

Jalankan migration secara manual:

**Windows (PowerShell):**

```powershell
cd backend
psql -U postgres -d nilasense_db -f database\migrations\008_add_password_reset.sql
```

**Linux/Mac:**

```bash
cd backend
psql -U postgres -d nilasense_db -f database/migrations/008_add_password_reset.sql
```

**Atau menggunakan psql langsung:**

```sql
\c nilasense_db

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_tokens(expires_at);
```

## Setelah Migration:

1. Restart backend server
2. Coba lagi request forgot password
3. Token akan muncul di console backend (jika email tidak dikonfigurasi)
