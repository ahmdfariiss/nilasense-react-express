# 🚀 Quick Start Guide - NilaSense ML Service

Panduan cepat untuk memulai training model dan menjalankan ML service.

## ⚡ Super Quick Start (5 Menit)

```bash
# 1. Masuk ke folder ml-service
cd ml-service

# 2. Setup virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Install Jupyter
pip install jupyter notebook ipykernel

# 5. Start Jupyter dan jalankan training notebook
jupyter notebook

# 6. Buka: notebooks/water_quality_model_training.ipynb
# 7. Run All Cells (Kernel → Restart & Run All)
# 8. Tunggu ~15-30 menit untuk training selesai
```

## 📝 Langkah Detail

### 1️⃣ Training Model

**Buka Jupyter Notebook:**

```bash
cd ml-service
jupyter notebook
```

**File:** `notebooks/water_quality_model_training.ipynb`

**Action:**

- Kernel → Restart & Run All
- Tunggu hingga selesai (~15-30 menit)

**Output yang diharapkan:**

- ✅ Model trained dengan accuracy ~95-99%
- ✅ 3 file di `models/trained/`:
  - `water_quality_rf_model.pkl`
  - `scaler.pkl`
  - `model_metadata.pkl`

### 2️⃣ Test Model (Optional)

```bash
# Test model tanpa menjalankan Flask
python test_prediction.py
```

**Output:**

- 5 test cases dengan berbagai kondisi air
- Hasil prediksi dengan confidence score
- Rekomendasi untuk setiap kasus

### 3️⃣ Start Flask API

```bash
# Dari folder ml-service
python run.py
```

**Expected:**

```
✅ ML Model loaded successfully!
   Model type: RandomForestClassifier
   Accuracy: XX.XX%
 * Running on http://127.0.0.1:5000
```

### 4️⃣ Test API

**Health Check:**

```bash
curl http://localhost:5000/api/health
```

**Get Model Info:**

```bash
curl http://localhost:5000/api/model/info
```

**Make Prediction:**

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d "{\"ph\": 7.2, \"temperature\": 28.5, \"turbidity\": 15.3, \"dissolved_oxygen\": 6.8}"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "quality": "Baik",
    "description": "Kualitas air dalam kondisi OPTIMAL...",
    "confidence": 0.95,
    "parameters": {...},
    "recommendations": [...],
    "issues": [...],
    "probabilities": {...}
  }
}
```

## 📁 File Structure

```
ml-service/
├── notebooks/
│   ├── water_quality_model_training.ipynb  ← TRAIN DI SINI
│   └── README.md
├── models/
│   └── trained/
│       ├── water_quality_rf_model.pkl      ← Output training
│       ├── scaler.pkl                      ← Output training
│       └── model_metadata.pkl              ← Output training
├── utils/
│   └── model_utils.py                      ← Load & predict logic
├── app/
│   ├── __init__.py                         ← Flask app factory
│   ├── routes.py                           ← API endpoints
│   └── predict.py                          ← Prediction logic
├── data/
│   └── samples/
│       └── Water_Quality_Dataset.csv       ← Dataset training
├── test_prediction.py                      ← Test script
├── run.py                                  ← Start Flask server
└── requirements.txt                        ← Dependencies
```

## 🎯 Model Specifications

**Algorithm:** Random Forest Classifier

**Input Features (4):**

1. pH (6.5-8.5 ideal)
2. Temperature (25-30°C ideal)
3. Turbidity (<25 NTU ideal)
4. Dissolved Oxygen (>5 mg/L ideal)

**Output Classes (3):**

1. **Baik** - Optimal water quality
2. **Normal** - Acceptable, needs monitoring
3. **Perlu Perhatian** - Poor, needs immediate action

**Expected Performance:**

- Accuracy: 95-99%
- Precision: 95-99%
- Recall: 95-99%
- Response Time: <100ms

## 🔧 Troubleshooting

### Model files not found

→ Run training notebook first

### Module not found

→ `pip install -r requirements.txt`

### Jupyter kernel not found

→ `python -m ipykernel install --user --name=nilasense-ml`

### Training too slow

→ Reduce GridSearchCV parameter grid in notebook

### Low accuracy

→ Check dataset quality, increase training data

## 📚 Documentation

- **Full Training Guide:** `ML_TRAINING_GUIDE.md`
- **Notebook README:** `notebooks/README.md`
- **Integration Guide:** `INTEGRATION.md`
- **API Documentation:** `README.md`

## 🎓 What's Inside the Training Notebook?

1. **Import Libraries** - Load required packages
2. **Load Dataset** - Read CSV (1000+ samples)
3. **EDA** - Visualize data distribution
4. **Preprocessing** - Select features, scale data
5. **Label Mapping** - 0,1,2 → Baik/Normal/Perlu Perhatian
6. **Training** - Random Forest with GridSearchCV
7. **Evaluation** - Metrics, confusion matrix, feature importance
8. **Saving** - Export model files
9. **Description Generator** - Create fish condition descriptions
10. **Testing** - Verify with sample data

## ✅ Checklist

- [ ] Virtual environment created & activated
- [ ] Dependencies installed
- [ ] Jupyter notebook running
- [ ] Training completed successfully
- [ ] Model files exist in `models/trained/`
- [ ] Test script runs without errors
- [ ] Flask server starts successfully
- [ ] API endpoints respond correctly

## 🚀 Ready for Production?

After completing all steps:

1. ✅ Model trained and tested
2. ✅ Flask API working locally
3. ⬜ Integrate with Express.js backend
4. ⬜ Deploy to production server
5. ⬜ Setup monitoring & logging
6. ⬜ Configure environment variables
7. ⬜ Setup HTTPS & authentication

## 💡 Tips

- **First time?** Follow `ML_TRAINING_GUIDE.md` for detailed instructions
- **Quick test?** Use `test_prediction.py` instead of starting Flask
- **Development?** Keep Jupyter notebook open for experimentation
- **Production?** Use gunicorn instead of `python run.py`

## 👥 Team

- Ahmad Faris AL Aziz (J0404231081)
- Bramantyo Wicaksono (J0404231053)
- M Faza Elrahman (J0404231155)

---

**Happy Training! 🎉**




