# 🏗️ Backend Folder Structure - NilaSense

## 📁 Struktur Folder (Best Practice)

```
backend/
├── src/                        # Source code utama
│   ├── config/                 # Konfigurasi aplikasi
│   │   ├── database.js         # Database connection
│   │   └── index.js            # Export semua config
│   │
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── feedController.js
│   │   ├── monitoringController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── pondController.js
│   │   ├── productController.js
│   │   └── userController.js
│   │
│   ├── routes/                 # API route definitions
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── feedRoutes.js
│   │   ├── monitoringRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── pondRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/               # Business logic & external services
│   │   └── mlService.js
│   │
│   ├── middleware/             # Express middleware
│   │   └── authMiddleware.js
│   │
│   └── app.js                  # Express app setup
│
├── database/                   # Database management
│   ├── migrations/             # Schema migrations
│   ├── seeds/                  # Seed data
│   ├── scripts/                # DB utility scripts
│   ├── index.js
│   ├── manager.js
│   └── README.md
│
├── tests/                      # Test files
│   └── test-ml-connection.js
│
├── server.js                   # Entry point
├── package.json
└── .env                        # Environment variables
```

## 🎯 Penjelasan Struktur

### **1. src/config/**
Berisi semua konfigurasi aplikasi:
- `database.js` - PostgreSQL connection pool
- `index.js` - Central config export (JWT, ML Service, Midtrans, dll)

### **2. src/controllers/**
Berisi request handlers yang memproses HTTP requests:
- Menerima input dari routes
- Memanggil services/models untuk business logic
- Mengembalikan HTTP responses

### **3. src/routes/**
Mendefinisikan API endpoints dan menghubungkan ke controllers:
- Route definitions
- Middleware assignments
- Parameter validation

### **4. src/services/**
Business logic dan integrasi external services:
- `mlService.js` - ML prediction service
- Dapat ditambahkan: emailService, notificationService, dll

### **5. src/middleware/**
Express middleware functions:
- `authMiddleware.js` - Authentication & authorization
- Dapat ditambahkan: errorHandler, validator, logger, dll

### **6. src/app.js**
Setup Express application:
- Middleware configuration
- Routes registration
- CORS setup
- Tidak menjalankan server (hanya export app)

### **7. server.js**
Entry point aplikasi:
- Load environment variables
- Import app dari src/app.js
- Start server dengan app.listen()

### **8. database/**
Database management tools:
- `migrations/` - Schema changes (versioned)
- `seeds/` - Sample data untuk development
- `scripts/` - Utility scripts untuk setup/seed

### **9. tests/**
Test files untuk testing:
- Unit tests
- Integration tests
- E2E tests

## 🚀 Cara Menjalankan

```bash
# Development mode
npm run dev

# Production mode
npm start

# Database setup
npm run db:setup

# Database seeding
npm run db:seed
npm run db:seed-monitoring
```

## 📝 Import Paths

### **Dari Controllers ke Config:**
```javascript
const db = require("../config/database");
const config = require("../config");
```

### **Dari Routes ke Controllers:**
```javascript
const authController = require("../controllers/authController");
```

### **Dari Controllers ke Services:**
```javascript
const mlService = require("../services/mlService");
```

### **Dari Database Scripts:**
```javascript
const db = require("../../src/config/database");
```

## ✅ Keuntungan Struktur Ini

1. **Separation of Concerns** - Setiap folder punya tanggung jawab yang jelas
2. **Scalability** - Mudah menambah features baru
3. **Maintainability** - Code lebih mudah di-maintain
4. **Testability** - Lebih mudah untuk menulis tests
5. **Industry Standard** - Mengikuti best practices Node.js/Express

## 🔄 Migration dari Struktur Lama

File yang dipindahkan:
- `db.js` → `src/config/database.js`
- `controllers/` → `src/controllers/`
- `routes/` → `src/routes/`
- `services/` → `src/services/`
- `middleware/` → `src/middleware/`
- `server.js` → Split menjadi `src/app.js` + `server.js`
- `scripts/seedMonitoringData.js` → `database/scripts/`
- `test-ml-connection.js` → `tests/`

Semua import paths sudah di-update secara otomatis.

## 📚 Next Steps

Untuk meningkatkan struktur lebih lanjut, bisa ditambahkan:
- `src/models/` - Database models/queries
- `src/validators/` - Input validation schemas
- `src/utils/` - Helper functions
- `src/middleware/errorHandler.js` - Centralized error handling
- `tests/unit/` - Unit tests
- `tests/integration/` - Integration tests
