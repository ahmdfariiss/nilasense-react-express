# 🏗️ Database Structure - NilaSense

## 📁 Folder Organization

```
backend/database/
├── 📄 README.md                 # Dokumentasi lengkap
├── 📄 STRUCTURE.md              # File ini - overview struktur
├── 📄 index.js                  # Entry point untuk imports
├── 📄 manager.js                # CLI database manager
│
├── 📂 migrations/               # Schema changes & updates
│   ├── 001_initial_schema.sql   # Schema awal (CREATE TABLE)
│   └── 002_feed_schema_update.sql # Update feed_schedules
│
├── 📂 seeds/                    # Sample data untuk testing
│   └── 001_initial_data.sql     # Users, ponds, logs, schedules
│
└── 📂 scripts/                  # Executable JavaScript files
    ├── seedDatabase.js          # Run seeds via JS
    ├── updateFeedDatabase.js    # Update feed schema via JS
    ├── setupDatabase.js         # Complete setup (schema + data)
    └── setupDatabaseSafe.js     # Safe setup (data only)
```

## 🎯 Quick Commands

### **Most Common (Recommended)**
```bash
# Database sudah ada, isi data sample
npm run db:setup-safe

# Check database status
npm run db:status

# Start application
npm start
```

### **Development**
```bash
# Fresh database setup
npm run db:setup

# Reset everything
npm run db:reset

# Update feed schema only
npm run db:update-feed
```

### **Advanced**
```bash
# CLI manager
npm run db:manager setup-safe
npm run db:manager status

# Individual operations
npm run db:seed
npm run db:update-feed
```

## 📊 Database Tables

1. **users** - Admin dan buyer accounts
2. **ponds** - Kolam ikan milik admin
3. **water_quality_logs** - Data sensor kualitas air
4. **feed_schedules** - Jadwal pemberian pakan
5. **products** - Produk yang dijual
6. **orders** - Pesanan dari buyer
7. **order_items** - Detail item pesanan

## 🔧 Environment Variables

Required in `.env`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=nilasense_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

## ✅ Success Indicators

Setelah setup berhasil:
- ✅ Connection successful
- ✅ Tables created/updated
- ✅ Sample data inserted
- ✅ Login credentials displayed

## 🚨 Common Issues

- **"user_role already exists"** → Use `npm run db:setup-safe`
- **"password authentication failed"** → Check .env DB_PASSWORD
- **"database does not exist"** → Run `createdb nilasense_db`
- **"relation does not exist"** → Run `npm run db:setup`