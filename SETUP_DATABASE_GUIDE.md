# 🗄️ Database Setup Guide - NilaSense

## 🔧 Prerequisites

1. **PostgreSQL terinstall** dan berjalan
2. **Database `nilasense_db` sudah dibuat**
3. **User PostgreSQL** dengan permissions

## 📋 Step-by-Step Setup

### 1. Create Database (jika belum ada)

```bash
# Option A: Using createdb command
createdb nilasense_db

# Option B: Using psql
psql -U postgres
CREATE DATABASE nilasense_db;
\q
```

### 2. Configure Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit .env file
nano .env
```

**Isi .env dengan credentials Anda:**
```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nilasense_db
DB_PASSWORD=your_actual_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database Schema & Data

```bash
# Option A: Complete setup (recommended)
npm run setup

# Option B: Step by step
npm run seed           # Original seed
npm run update-feed    # Feed updates only
```

## 🚨 Troubleshooting

### Error: `password authentication failed`

**Solusi:**
1. Check PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Linux/Mac
   sudo service postgresql start
   ```

2. Verify credentials:
   ```bash
   psql -U postgres -d nilasense_db
   ```

3. Reset password if needed:
   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'newpassword';
   ```

### Error: `database "nilasense_db" does not exist`

**Solusi:**
```bash
# Create database
createdb -U postgres nilasense_db

# Or via psql
psql -U postgres
CREATE DATABASE nilasense_db;
```

### Error: `relation "users" does not exist`

**Solusi:**
```bash
# Run complete setup
npm run setup
```

## ✅ Verification

Setelah setup berhasil, Anda akan melihat:

```
✅ Database setup completed successfully!
📊 Sample data created:
   - 2 users (admin & buyer)
   - 3 ponds with sample names
   - 60+ water quality logs (7 days)
   - 12 feed schedules (today & tomorrow)
   - 5 sample products

🔑 Login credentials:
   Admin: admin@demo.com / password123
   User:  user@demo.com / password123
```

## 🚀 Start Application

```bash
# Start backend
npm start

# Start frontend (new terminal)
cd ../frontend
npm run dev
```

## 📊 Test Data

Database akan berisi:
- **Users**: Admin dan Buyer untuk testing
- **Ponds**: 3 kolam dengan nama berbeda
- **Water Quality**: 7 hari data monitoring
- **Feed Schedules**: Jadwal hari ini dan besok
- **Products**: 5 produk sample

## 🔄 Reset Database

Jika perlu reset ulang:

```bash
# Drop and recreate
dropdb nilasense_db
createdb nilasense_db
npm run setup
```