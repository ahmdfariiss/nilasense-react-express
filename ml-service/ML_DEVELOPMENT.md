# 🧪 ML Development Guide - NilaSense

## 📊 Dataset & Development Environment

### Development Tools

- **Jupyter Notebook** (Anaconda)
- **Dataset Source**: Kaggle
- **Training Format**: `.ipynb` files
- **Model Export**: `.pkl` (scikit-learn) atau `.h5` (Keras/TensorFlow)

## 📁 Struktur untuk ML Development

```
ml-service/
├── notebooks/              # Jupyter Notebooks (NEW)
│   ├── 01_data_exploration.ipynb
│   ├── 02_preprocessing.ipynb
│   ├── 03_model_training.ipynb
│   ├── 04_model_evaluation.ipynb
│   └── 05_model_export.ipynb
├── data/
│   ├── raw/               # Dataset dari Kaggle (.csv)
│   │   └── water_quality_dataset.csv
│   ├── processed/         # Processed data
│   │   └── training_data.csv
│   └── samples/
└── models/
    ├── trained/           # Model hasil export dari notebook
    │   ├── water_quality_model.pkl
    │   └── scaler.pkl
    └── training/
```

## 🚀 Setup Anaconda & Jupyter

### 1. Install Anaconda

Download dari: https://www.anaconda.com/download

### 2. Create Conda Environment

```bash
# Buat environment baru
conda create -n nilasense python=3.9

# Activate environment
conda activate nilasense

# Install dependencies
pip install -r requirements.txt

# Install Jupyter
conda install jupyter notebook
# atau
pip install jupyter notebook

# Install additional packages for data science
conda install pandas numpy matplotlib seaborn scikit-learn
```

### 3. Setup Jupyter dengan Project

```bash
# Navigate ke ml-service
cd ml-service

# Activate conda environment
conda activate nilasense

# Start Jupyter Notebook
jupyter notebook

# Atau Jupyter Lab (recommended)
jupyter lab
```

Browser akan otomatis terbuka di: `http://localhost:8888`

## 📥 Download Dataset dari Kaggle

### Option 1: Manual Download

1. Buka https://www.kaggle.com/datasets
2. Search untuk "water quality" dataset
3. Download sebagai CSV
4. Simpan di `ml-service/data/raw/`

### Option 2: Kaggle API (Recommended)

```bash
# Install Kaggle API
pip install kaggle

# Setup Kaggle credentials
# 1. Login ke Kaggle.com
# 2. Go to Account -> Create New API Token
# 3. Download kaggle.json
# 4. Place kaggle.json di:
#    Windows: C:\Users\<username>\.kaggle\kaggle.json
#    Linux/Mac: ~/.kaggle/kaggle.json

# Download dataset
kaggle datasets download -d <dataset-name>

# Unzip
unzip <dataset-name>.zip -d data/raw/
```

### Recommended Datasets

1. **Water Quality Dataset**

   ```bash
   kaggle datasets download -d adityakadiwal/water-potability
   ```

2. **Aquaculture Water Quality**
   ```bash
   kaggle datasets download -d mssmartypants/water-quality
   ```

## 📓 Workflow Development dengan Notebook

### 1. Data Exploration (`01_data_exploration.ipynb`)

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
df = pd.read_csv('data/raw/water_quality_dataset.csv')

# Basic info
print(df.info())
print(df.describe())
print(df.isnull().sum())

# Visualizations
df.hist(bins=20, figsize=(15, 10))
plt.tight_layout()
plt.show()

# Correlation matrix
plt.figure(figsize=(10, 8))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('Feature Correlation Matrix')
plt.show()
```

### 2. Data Preprocessing (`02_preprocessing.ipynb`)

```python
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Load data
df = pd.read_csv('data/raw/water_quality_dataset.csv')

# Handle missing values
df = df.dropna()  # atau df.fillna(df.mean())

# Feature selection
features = ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']
X = df[features]
y = df['quality']  # 'Baik', 'Normal', 'Buruk'

# Encode labels
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save processed data
processed_df = pd.DataFrame(X_train_scaled, columns=features)
processed_df['quality'] = y_train
processed_df.to_csv('data/processed/training_data.csv', index=False)

# Save scaler
import joblib
joblib.dump(scaler, 'models/trained/scaler.pkl')
joblib.dump(le, 'models/trained/label_encoder.pkl')
```

### 3. Model Training (`03_model_training.ipynb`)

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
import joblib

# Option 1: Random Forest
rf_model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X_train_scaled, y_train)

# Option 2: Neural Network
nn_model = MLPClassifier(
    hidden_layer_sizes=(64, 32, 16),
    activation='relu',
    solver='adam',
    max_iter=1000,
    random_state=42
)
nn_model.fit(X_train_scaled, y_train)

# Save best model
joblib.dump(rf_model, 'models/trained/water_quality_model.pkl')
print("Model saved successfully!")
```

### 4. Model Evaluation (`04_model_evaluation.ipynb`)

```python
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)
import matplotlib.pyplot as plt
import seaborn as sns

# Load model
model = joblib.load('models/trained/water_quality_model.pkl')

# Predictions
y_pred = model.predict(X_test_scaled)

# Metrics
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=['Buruk', 'Normal', 'Baik']
))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# Feature Importance (for Random Forest)
if hasattr(model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    plt.figure(figsize=(10, 6))
    sns.barplot(data=feature_importance, x='importance', y='feature')
    plt.title('Feature Importance')
    plt.show()
```

### 5. Model Export (`05_model_export.ipynb`)

```python
import joblib
import json
from datetime import datetime

# Save model metadata
metadata = {
    'model_type': 'Random Forest Classifier',
    'features': ['ph', 'temperature', 'turbidity', 'dissolved_oxygen'],
    'classes': ['Buruk', 'Normal', 'Baik'],
    'accuracy': float(accuracy),
    'trained_date': datetime.now().isoformat(),
    'version': '1.0.0'
}

with open('models/trained/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("✅ Model export completed!")
print(f"Model path: models/trained/water_quality_model.pkl")
print(f"Scaler path: models/trained/scaler.pkl")
print(f"Metadata: models/trained/model_metadata.json")
```

## 🔄 Integration dengan Flask API

Setelah model trained dan exported:

### 1. Update `app/predict.py`

```python
import joblib
import numpy as np
import os

# Load model saat startup
MODEL_PATH = 'models/trained/water_quality_model.pkl'
SCALER_PATH = 'models/trained/scaler.pkl'
ENCODER_PATH = 'models/trained/label_encoder.pkl'

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("✅ Model loaded successfully!")
else:
    model = None
    scaler = None
    label_encoder = None
    print("⚠️  No trained model found, using rule-based prediction")

def predict_water_quality(sensor_data):
    """Predict using trained ML model"""
    try:
        # Extract features
        features = np.array([[
            sensor_data['ph'],
            sensor_data['temperature'],
            sensor_data['turbidity'],
            sensor_data['dissolved_oxygen']
        ]])

        if model is not None:
            # Scale features
            features_scaled = scaler.transform(features)

            # Predict
            prediction = model.predict(features_scaled)[0]
            confidence = model.predict_proba(features_scaled).max()

            # Decode label
            quality = label_encoder.inverse_transform([prediction])[0]
        else:
            # Fallback to rule-based
            quality = rule_based_prediction(sensor_data)
            confidence = 0.85

        # Generate description and recommendations
        description = get_water_quality_description(quality, sensor_data)
        recommendations = get_recommendations(quality, sensor_data)

        return {
            'quality': quality,
            'description': description,
            'parameters': sensor_data,
            'recommendations': recommendations,
            'prediction_confidence': float(confidence),
            'model_used': 'ML' if model else 'Rule-based'
        }

    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")
```

## 📦 Export untuk Production

### Checklist sebelum deploy:

```python
# Di notebook terakhir
import os

files_to_check = [
    'models/trained/water_quality_model.pkl',
    'models/trained/scaler.pkl',
    'models/trained/label_encoder.pkl',
    'models/trained/model_metadata.json'
]

for file in files_to_check:
    if os.path.exists(file):
        size = os.path.getsize(file) / 1024  # KB
        print(f"✅ {file} ({size:.2f} KB)")
    else:
        print(f"❌ {file} NOT FOUND!")
```

## 🔬 Testing Model in Notebook

```python
# Test prediction
test_sample = {
    'ph': 7.2,
    'temperature': 28.5,
    'turbidity': 15.3,
    'dissolved_oxygen': 6.8
}

# Prepare features
features = np.array([[
    test_sample['ph'],
    test_sample['temperature'],
    test_sample['turbidity'],
    test_sample['dissolved_oxygen']
]])

# Scale
features_scaled = scaler.transform(features)

# Predict
prediction = model.predict(features_scaled)[0]
confidence = model.predict_proba(features_scaled).max()
quality = label_encoder.inverse_transform([prediction])[0]

print(f"Prediction: {quality}")
print(f"Confidence: {confidence:.2%}")
```

## 📚 Additional Resources

### Recommended Kaggle Notebooks

- Water Quality Classification: https://www.kaggle.com/code
- Random Forest for Water Quality
- Deep Learning for Environmental Data

### Learning Resources

- Scikit-learn Documentation: https://scikit-learn.org/
- Pandas Tutorial: https://pandas.pydata.org/docs/
- Kaggle Learn: https://www.kaggle.com/learn

## 🎯 Best Practices

1. **Version Control**

   - Git commit setiap milestone
   - Save notebook dengan versioning: `model_v1.0.ipynb`

2. **Documentation**

   - Comment setiap cell
   - Markdown cells untuk explanation
   - Document hasil metrics

3. **Model Management**

   - Save multiple versions
   - Track performance metrics
   - Backup sebelum experiment baru

4. **Data Management**
   - Keep raw data unchanged
   - Document preprocessing steps
   - Version processed datasets

## 🚀 Quick Start Checklist

- [ ] Install Anaconda
- [ ] Create conda environment
- [ ] Download dataset dari Kaggle
- [ ] Setup Jupyter Notebook
- [ ] Run data exploration
- [ ] Train model
- [ ] Export model (.pkl)
- [ ] Test integration dengan Flask
- [ ] Deploy to production

## 💡 Tips

1. **Start Simple**: Mulai dengan model sederhana (Logistic Regression)
2. **Iterate**: Gradually improve dengan model yang lebih complex
3. **Cross-validation**: Use K-fold untuk reliable metrics
4. **Feature Engineering**: Experiment dengan feature combinations
5. **Hyperparameter Tuning**: Use GridSearchCV atau RandomizedSearchCV

---

**Good luck with your ML development! 🤖📊**
