# 🚀 Setup Guide - NilaSense ML Service

## 📁 Struktur Folder Lengkap

```
nilasense-react-express-cursor-6/
├── backend/              # Express.js Backend
├── frontend/             # React Frontend
└── ml-service/          # Flask ML Service (NEW)
    ├── app/             # Flask application
    │   ├── __init__.py
    │   ├── routes.py    # API endpoints
    │   ├── predict.py   # Prediction logic
    │   └── validators.py
    ├── models/          # ML models
    │   ├── __init__.py
    │   ├── trained/     # Trained model files
    │   └── training/
    │       └── train_model.py
    ├── data/            # Datasets
    │   ├── raw/
    │   ├── processed/
    │   └── samples/
    │       └── sample_data.json
    ├── tests/           # Unit tests
    │   ├── __init__.py
    │   └── test_api.py
    ├── config/          # Configuration
    │   ├── __init__.py
    │   └── config.py
    ├── utils/           # Utilities
    │   ├── __init__.py
    │   ├── logger.py
    │   └── helpers.py
    ├── logs/            # Log files (auto-created)
    ├── venv/            # Virtual environment (auto-created)
    ├── requirements.txt
    ├── env.example
    ├── .gitignore
    ├── run.py
    ├── README.md
    ├── INTEGRATION.md
    └── SETUP_GUIDE.md (this file)
```

## ⚙️ Setup Step by Step

### 1. Prerequisites

Pastikan sudah terinstall:

- ✅ Python 3.8 atau lebih baru
- ✅ pip (Python package manager)
- ✅ Git

Check instalasi:

```bash
python --version
pip --version
```

### 2. Setup Virtual Environment

```bash
# Navigate ke folder ml-service
cd ml-service

# Buat virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Verify activation (akan ada (venv) di prompt)
```

### 3. Install Dependencies

```bash
# Install semua dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### 4. Setup Environment Variables

```bash
# Copy file example
copy env.example .env    # Windows
# atau
cp env.example .env      # Linux/Mac

# Edit .env file dengan text editor
```

Edit `.env`:

```env
FLASK_ENV=development
FLASK_PORT=5000
FLASK_DEBUG=True
```

### 5. Test Installation

```bash
# Run the application
python run.py
```

Jika berhasil, akan muncul:

```
==================================================
🐟 NilaSense ML Service Starting...
==================================================
Environment: development
Port: 5000
Debug Mode: True
==================================================

 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

### 6. Test API

Buka browser atau gunakan curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d "{\"ph\":7.2,\"temperature\":28.5,\"turbidity\":15.3,\"dissolved_oxygen\":6.8}"
```

## 🧪 Running Tests

```bash
# Install pytest (jika belum)
pip install pytest pytest-cov

# Run all tests
pytest

# Run with coverage report
pytest --cov=app tests/

# Run specific test file
pytest tests/test_api.py -v
```

## 📊 Prepare Training Data

### 1. Collect Data

Kumpulkan data sensor dari database atau IoT devices:

```csv
ph,temperature,turbidity,dissolved_oxygen,quality
7.2,28.5,15.3,6.8,Baik
6.8,27.0,22.0,5.5,Normal
5.5,33.0,45.0,3.2,Buruk
```

Simpan sebagai: `data/processed/training_data.csv`

### 2. Train Model

```bash
# Run training script
python models/training/train_model.py
```

Model akan disimpan di: `models/trained/`

## 🔗 Integrasi dengan Backend

### Update Backend

1. Install axios di backend (jika belum):

```bash
cd ../backend
npm install axios
```

2. Buat file `backend/services/mlService.js` (lihat INTEGRATION.md)

3. Update `backend/controllers/monitoringController.js`

4. Update `backend/.env`:

```env
ML_SERVICE_URL=http://localhost:5000
ML_SERVICE_ENABLED=true
```

### Test Integration

```bash
# Terminal 1: ML Service
cd ml-service
source venv/bin/activate
python run.py

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

## 🚀 Production Deployment

### Option 1: Using Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 run:app
```

### Option 2: Using PM2 (with systemd)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
pm2 ecosystem
```

Edit `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "nilasense-ml",
      cwd: "./ml-service",
      script: "venv/bin/gunicorn",
      args: "-w 4 -b 0.0.0.0:5000 run:app",
      env: {
        FLASK_ENV: "production",
      },
    },
  ],
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

Build and run:

```bash
docker build -t nilasense-ml .
docker run -p 5000:5000 --env-file .env nilasense-ml
```

## 📝 Maintenance

### Update Dependencies

```bash
# Check outdated packages
pip list --outdated

# Update specific package
pip install --upgrade package-name

# Update requirements.txt
pip freeze > requirements.txt
```

### Backup Model

```bash
# Backup trained models
tar -czf models_backup_$(date +%Y%m%d).tar.gz models/trained/
```

### Monitor Logs

```bash
# View logs in real-time
tail -f logs/app.log

# Search for errors
grep "ERROR" logs/app.log
```

## ❓ Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Module Not Found Error

```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check Python path
python -c "import sys; print(sys.path)"
```

### Permission Denied

```bash
# Linux/Mac - Fix permissions
chmod +x run.py
sudo chown -R $USER:$USER ml-service/
```

## 📚 Next Steps

1. ✅ Setup completed
2. 📊 Collect training data
3. 🤖 Train ML model
4. 🔗 Integrate with backend
5. 🧪 Test end-to-end
6. 🚀 Deploy to production

## 📞 Support

Jika ada masalah:

1. Check logs di `logs/app.log`
2. Lihat INTEGRATION.md untuk integrasi
3. Lihat README.md untuk API documentation
4. Contact team developer

## 🎓 Team

- Ahmad Faris AL Aziz (J0404231081)
- Bramantyo Wicaksono (J0404231053)
- M Faza Elrahman (J0404231155)

---

**Happy Coding! 🐟🤖**
