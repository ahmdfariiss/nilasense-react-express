# 🎓 ML Training Guide - NilaSense Water Quality Model

Panduan lengkap untuk training model Machine Learning klasifikasi kualitas air.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup Environment](#setup-environment)
3. [Dataset Preparation](#dataset-preparation)
4. [Training Process](#training-process)
5. [Model Evaluation](#model-evaluation)
6. [Integration with Flask API](#integration-with-flask-api)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Software Requirements

- **Python**: 3.8 atau lebih tinggi
- **Jupyter Notebook**: Untuk training interaktif
- **Git**: Untuk version control

### Hardware Requirements

- **RAM**: Minimal 4GB (recommended 8GB+)
- **Storage**: 500MB free space
- **CPU**: Multi-core processor recommended for faster training

### Knowledge Requirements

- Basic Python programming
- Understanding of Machine Learning concepts
- Familiarity with pandas, scikit-learn

---

## Setup Environment

### 1. Navigate to ML Service Directory

```bash
cd ml-service
```

### 2. Create Virtual Environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Verify Installation

```bash
python -c "import sklearn, pandas, numpy, joblib; print('✅ All packages installed successfully!')"
```

### 5. Install Jupyter (if not already installed)

```bash
pip install jupyter notebook ipykernel
python -m ipykernel install --user --name=nilasense-ml
```

---

## Dataset Preparation

### Dataset Location

Dataset sudah tersedia di: `ml-service/data/samples/Water_Quality_Dataset.csv`

### Dataset Structure

**Total Records**: ~1,000 samples  
**Features**: 10 columns  
**Target**: Pollution_Level (0, 1, 2)

**Columns:**

```
- Timestamp          (datetime)
- Location           (categorical)
- pH                 (float) ← USED
- Turbidity (NTU)    (float) ← USED
- Temperature (°C)   (float) ← USED
- DO (mg/L)          (float) ← USED (Dissolved Oxygen)
- BOD (mg/L)         (float)
- Lead (mg/L)        (float)
- Mercury (mg/L)     (float)
- Arsenic (mg/L)     (float)
- Pollution_Level    (int) ← TARGET
```

**Selected Features** (4 parameters yang digunakan):

1. **pH**: 6.5-8.5 ideal untuk ikan nila
2. **Temperature**: 25-30°C optimal
3. **Turbidity**: <25 NTU ideal
4. **Dissolved Oxygen (DO)**: >5 mg/L minimal

**Target Mapping:**

- `0` → `Baik` (Good water quality)
- `1` → `Normal` (Acceptable water quality)
- `2` → `Perlu Perhatian` (Poor water quality, needs attention)

### Data Quality Check

```python
import pandas as pd

df = pd.read_csv('data/samples/Water_Quality_Dataset.csv')
print(f"Total records: {len(df)}")
print(f"Missing values: {df.isnull().sum().sum()}")
print(f"Classes distribution:\n{df['Pollution_Level'].value_counts()}")
```

---

## Training Process

### Step 1: Launch Jupyter Notebook

```bash
cd ml-service
jupyter notebook
```

Browser will open automatically. Navigate to:
`notebooks/water_quality_model_training.ipynb`

### Step 2: Run Training Notebook

**Option A: Run All Cells**

- Kernel → Restart & Run All
- Or: Cell → Run All

**Option B: Step-by-Step** (Recommended for first time)

- Press `Shift + Enter` to run each cell sequentially
- Review outputs after each cell
- Understand what each section does

### Step 3: Training Steps Overview

The notebook will execute following steps:

1. **Data Loading** (~5 seconds)

   - Load CSV dataset
   - Display basic statistics

2. **EDA (Exploratory Data Analysis)** (~30 seconds)

   - Visualize data distributions
   - Check correlations
   - Analyze class imbalance

3. **Preprocessing** (~10 seconds)

   - Select 4 key features
   - Map labels to text
   - Split train/test (80/20)
   - Feature scaling

4. **Baseline Model Training** (~1 minute)

   - Train Random Forest with default params
   - Get baseline accuracy

5. **Hyperparameter Tuning** (~10-30 minutes ⏳)

   - GridSearchCV with 5-fold CV
   - Test multiple parameter combinations
   - **This is the longest step!**

6. **Model Evaluation** (~10 seconds)

   - Classification report
   - Confusion matrix
   - Feature importance
   - Cross-validation scores

7. **Model Saving** (~5 seconds)

   - Save trained model
   - Save scaler
   - Save metadata

8. **Testing** (~5 seconds)
   - Test with sample data
   - Verify predictions work

**Total Time**: Approximately 15-35 minutes (depending on your CPU)

### Step 4: Monitor Training Progress

Look for these indicators:

```
✅ All libraries imported successfully!
✅ Dataset loaded: 1,001 records
✅ Training started...
✅ Grid Search completed!
🏆 Best accuracy: XX.XX%
✅ Model saved successfully!
```

### Step 5: Verify Output Files

After training completes, check `models/trained/`:

```bash
ls -lh models/trained/
```

You should see:

```
water_quality_rf_model.pkl    # Main model (~1-5 MB)
scaler.pkl                     # Feature scaler (~1 KB)
model_metadata.pkl             # Model info (~5 KB)
```

---

## Model Evaluation

### Expected Performance Metrics

Based on the dataset, you should achieve:

```
Overall Accuracy:  95-99%
Precision:         95-99%
Recall:            95-99%
F1-Score:          95-99%
```

**Per-Class Metrics:**

```
              precision    recall  f1-score   support
Baik              0.98      0.99      0.98       XX
Normal            0.96      0.95      0.96       XX
Perlu Perhatian   0.99      0.98      0.98       XX
```

### Feature Importance

Expected feature importance (approximate):

1. **Dissolved Oxygen**: ~30-35% (most important)
2. **pH**: ~25-30%
3. **Temperature**: ~20-25%
4. **Turbidity**: ~15-20%

### Confusion Matrix Interpretation

Perfect model confusion matrix (ideal):

```
                Predicted
              Baik  Normal  Perlu Perhatian
Actual Baik     XX     0        0
     Normal      0    XX        0
     Perlu       0     0       XX
```

Good model (acceptable):

```
                Predicted
              Baik  Normal  Perlu Perhatian
Actual Baik     XX     2        0
     Normal      1    XX        1
     Perlu       0     1       XX
```

---

## Integration with Flask API

### 1. Verify Model Files Exist

```bash
ls ml-service/models/trained/
```

Should show:

- `water_quality_rf_model.pkl`
- `scaler.pkl`
- `model_metadata.pkl`

### 2. Start Flask Service

```bash
cd ml-service
python run.py
```

Expected output:

```
✅ ML Model loaded successfully!
   Model type: RandomForestClassifier
   Accuracy: XX.XX%
   Training date: 2024-XX-XX XX:XX:XX
 * Running on http://127.0.0.1:5000
```

### 3. Test API Endpoint

**Health Check:**

```bash
curl http://localhost:5000/api/health
```

**Model Info:**

```bash
curl http://localhost:5000/api/model/info
```

**Prediction:**

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 7.2,
    "temperature": 28.5,
    "turbidity": 15.3,
    "dissolved_oxygen": 6.8
  }'
```

Expected response:

```json
{
  "success": true,
  "data": {
    "quality": "Baik",
    "description": "Kualitas air dalam kondisi OPTIMAL...",
    "confidence": 0.95,
    "recommendations": [...],
    "parameters": {...}
  }
}
```

---

## Testing

### Unit Testing

```bash
cd ml-service
pytest tests/test_api.py -v
```

### Integration Testing

Test with various scenarios:

**1. Optimal Water Quality:**

```json
{
  "ph": 7.2,
  "temperature": 28.0,
  "turbidity": 15.0,
  "dissolved_oxygen": 6.5
}
```

Expected: **"Baik"**

**2. Marginal Water Quality:**

```json
{
  "ph": 6.8,
  "temperature": 26.5,
  "turbidity": 28.0,
  "dissolved_oxygen": 4.8
}
```

Expected: **"Normal"**

**3. Poor Water Quality:**

```json
{
  "ph": 5.5,
  "temperature": 34.0,
  "turbidity": 55.0,
  "dissolved_oxygen": 2.5
}
```

Expected: **"Perlu Perhatian"**

### Performance Testing

```bash
# Test response time
time curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"ph": 7.2, "temperature": 28.5, "turbidity": 15.3, "dissolved_oxygen": 6.8}'
```

Expected: **< 100ms response time**

---

## Troubleshooting

### Common Issues

#### 1. "Module not found" Error

**Problem:**

```
ModuleNotFoundError: No module named 'sklearn'
```

**Solution:**

```bash
pip install -r requirements.txt
```

#### 2. Jupyter Kernel Not Found

**Problem:**
Kernel "Python 3" not available

**Solution:**

```bash
python -m ipykernel install --user --name=nilasense-ml
```

Then select "nilasense-ml" kernel in Jupyter.

#### 3. Model Files Not Found

**Problem:**

```
FileNotFoundError: models/trained/water_quality_rf_model.pkl
```

**Solution:**
Run training notebook first to generate model files.

#### 4. Memory Error During Training

**Problem:**

```
MemoryError: Unable to allocate array
```

**Solution:**

- Close other applications
- Reduce GridSearchCV parameter combinations
- Use smaller dataset sample
- Increase system swap/virtual memory

#### 5. GridSearchCV Taking Too Long

**Problem:**
GridSearchCV running for > 1 hour

**Solution:**
Reduce parameter grid in notebook:

```python
param_grid = {
    'n_estimators': [100],          # Instead of [100, 200, 300]
    'max_depth': [20, None],        # Instead of [10, 20, 30, None]
    'min_samples_split': [2, 5],    # Instead of [2, 5, 10]
    'min_samples_leaf': [1, 2],     # Instead of [1, 2, 4]
    'max_features': ['sqrt']        # Instead of ['sqrt', 'log2']
}
```

#### 6. Low Model Accuracy

**Problem:**
Model accuracy < 90%

**Possible Causes:**

- Poor quality dataset
- Class imbalance
- Insufficient training data
- Wrong hyperparameters

**Solution:**

- Check data quality
- Increase training data
- Try different algorithms
- Adjust hyperparameters

#### 7. Flask API Not Loading Model

**Problem:**

```
⚠️ Warning: Could not load ML model
```

**Solution:**

1. Check model files exist in `models/trained/`
2. Verify file permissions
3. Check Python path includes `ml-service/`
4. Re-run training notebook

---

## Best Practices

### 1. Version Control

Commit model metadata and code, NOT the binary model files:

```bash
# .gitignore
models/trained/*.pkl
```

Instead, save model info:

```bash
git add models/trained/model_info.json
```

### 2. Model Versioning

Include timestamp in model filename:

```python
model_name = f'water_quality_rf_model_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pkl'
```

### 3. Regular Retraining

Retrain model monthly or when:

- New data available
- Performance degrades
- Requirements change

### 4. Monitor Performance

Track metrics over time:

- Prediction accuracy on new data
- Response time
- Error rates

### 5. Backup Models

Keep backup of production model:

```bash
cp models/trained/water_quality_rf_model.pkl models/backup/
```

---

## Next Steps

After successful training:

1. ✅ Verify model performance metrics
2. ✅ Test Flask API locally
3. ✅ Integrate with Express.js backend
4. ✅ Deploy to production
5. ✅ Setup monitoring & logging
6. ✅ Plan regular model updates

---

## Support & Resources

### Documentation

- scikit-learn: https://scikit-learn.org/
- Random Forest: https://scikit-learn.org/stable/modules/ensemble.html#forest
- Flask: https://flask.palletsprojects.com/

### Contact

For issues or questions, contact the development team.

### Team

- Ahmad Faris AL Aziz (J0404231081)
- Bramantyo Wicaksono (J0404231053)
- M Faza Elrahman (J0404231155)

---

**Good luck with your model training! 🚀**




