# 🗄️ Database Management - NilaSense

## 📁 Struktur Folder

```
backend/database/
├── README.md                    # Dokumentasi ini
├── index.js                     # Entry point untuk database operations
├── migrations/                  # Schema migrations
│   ├── 001_initial_schema.sql   # Schema awal (users, ponds, etc.)
│   └── 002_feed_schema_update.sql # Update feed_schedules table
├── seeds/                       # Sample data
│   └── 001_initial_data.sql     # Data awal untuk testing
└── scripts/                     # JavaScript executables
    ├── seedDatabase.js          # Original seed script
    ├── updateFeedDatabase.js    # Feed schema update script
    ├── setupDatabase.js         # Complete setup (schema + data)
    └── setupDatabaseSafe.js     # Safe setup (data only)
```

## 🚀 Available Scripts

### **Setup & Seeding**
```bash
# Complete setup (schema + data) - untuk database baru
npm run db:setup

# Safe setup (data only) - untuk database yang sudah ada
npm run db:setup-safe

# Original seed data only
npm run db:seed

# Update feed schema only
npm run db:update-feed
```

### **Development**
```bash
# Reset database completely
npm run db:reset

# Backup database
npm run db:backup

# Restore database
npm run db:restore
```

## 📋 Migration Files

### **001_initial_schema.sql**
- Creates all initial tables
- Sets up user roles enum
- Establishes foreign key relationships

### **002_feed_schema_update.sql**
- Adds feed_type, status, created_at columns
- Updates existing records for consistency
- Adds sample feed schedules

## 🌱 Seed Files

### **001_initial_data.sql**
- Sample users (admin & buyer)
- Sample ponds (3 kolam)
- Water quality logs (7 days)
- Feed schedules (today & tomorrow)
- Sample products

## 🔧 Script Files

### **setupDatabase.js**
- **Use case**: Fresh database setup
- **What it does**: Creates schema + inserts data
- **Risk**: Will fail if schema already exists

### **setupDatabaseSafe.js**
- **Use case**: Existing database
- **What it does**: Inserts data only, skips schema
- **Risk**: Low, safe for existing databases

### **seedDatabase.js**
- **Use case**: Original seeding method
- **What it does**: Runs 001_initial_data.sql
- **Risk**: Medium, may conflict with existing data

### **updateFeedDatabase.js**
- **Use case**: Feed schema updates
- **What it does**: Runs 002_feed_schema_update.sql
- **Risk**: Medium, updates schema and data

## 🎯 Recommended Usage

### **New Project Setup**
```bash
# 1. Create database
createdb nilasense_db

# 2. Setup everything
npm run db:setup
```

### **Existing Project**
```bash
# Safe data refresh
npm run db:setup-safe
```

### **Development Reset**
```bash
# Complete reset
npm run db:reset
npm run db:setup
```

## ⚠️ Important Notes

1. **Always backup** before running migrations
2. **Check .env file** before running any script
3. **Use setup-safe** for existing databases
4. **Test scripts** on development first

## 🔮 Future Enhancements

- [ ] Migration runner with version control
- [ ] Seed runner with selective seeding
- [ ] Database backup/restore automation
- [ ] Schema diff and auto-migration
- [ ] Test data factories