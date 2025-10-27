# 📓 Jupyter Notebooks

Folder ini berisi Jupyter Notebooks untuk ML development workflow.

## 📋 Workflow Notebooks

Gunakan notebooks ini secara berurutan:

### 1️⃣ Data Exploration

`01_data_exploration.ipynb`

- Load dataset dari Kaggle
- Exploratory Data Analysis (EDA)
- Visualizations
- Statistical analysis

### 2️⃣ Data Preprocessing

`02_preprocessing.ipynb`

- Handle missing values
- Feature engineering
- Data normalization/scaling
- Train-test split
- Export processed data

### 3️⃣ Model Training

`03_model_training.ipynb`

- Train multiple models (Random Forest, Neural Network, etc.)
- Hyperparameter tuning
- Model comparison
- Save best model

### 4️⃣ Model Evaluation

`04_model_evaluation.ipynb`

- Performance metrics
- Confusion matrix
- Feature importance
- ROC curves
- Model analysis

### 5️⃣ Model Export

`05_model_export.ipynb`

- Export model to .pkl
- Export scaler and encoders
- Create model metadata
- Prepare for Flask integration

## 🚀 Quick Start

```bash
# Activate conda environment
conda activate nilasense

# Start Jupyter
cd ml-service
jupyter notebook

# Or Jupyter Lab
jupyter lab
```

## 📊 Dataset

Simpan dataset dari Kaggle di:

```
../data/raw/water_quality_dataset.csv
```

## 💾 Output Files

Setelah training, files akan tersimpan di:

- `../models/trained/water_quality_model.pkl` - Trained model
- `../models/trained/scaler.pkl` - Feature scaler
- `../models/trained/label_encoder.pkl` - Label encoder
- `../models/trained/model_metadata.json` - Model info

## 📝 Notes

- Commit notebooks after setiap milestone
- Clear output sebelum commit (untuk ukuran file)
- Document findings di markdown cells
- Save multiple versions jika experiment baru

## 🎯 Tips

1. Run cells secara berurutan
2. Restart kernel jika ada error
3. Save regularly (Ctrl+S)
4. Export notebooks as HTML untuk dokumentasi

---

Happy experimenting! 🧪🤖
