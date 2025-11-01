# 📓 NilaSense - Jupyter Notebooks

Folder ini berisi Jupyter notebooks untuk pengembangan dan training model Machine Learning.

## 📁 Contents

### 1. `water_quality_model_training.ipynb`

**Main training notebook untuk model klasifikasi kualitas air**

#### 🎯 Tujuan

Melatih model Random Forest Classifier untuk mengklasifikasikan kualitas air kolam ikan nila berdasarkan 4 parameter sensor IoT.

#### 📊 Input Features

1. **pH** - Tingkat keasaman/basa air (ideal: 6.5-8.5)
2. **Suhu (Temperature)** - Suhu air dalam °C (ideal: 25-30°C)
3. **Kekeruhan (Turbidity)** - Tingkat kekeruhan dalam NTU (ideal: <25 NTU)
4. **Oksigen Terlarut (DO)** - Kadar oksigen dalam mg/L (ideal: >5 mg/L)

#### 🏷️ Output Classes

- **Baik** - Kondisi optimal untuk pertumbuhan ikan nila
- **Normal** - Kondisi masih layak namun perlu monitoring
- **Perlu Perhatian** - Kondisi berbahaya, perlu tindakan segera

#### 📦 What's Included

1. **Data Loading & EDA**

   - Load dataset dari `data/samples/Water_Quality_Dataset.csv`
   - Exploratory data analysis dengan visualisasi
   - Statistik deskriptif per kelas

2. **Data Preprocessing**

   - Feature selection (4 parameter utama)
   - Label mapping (0,1,2 → Baik/Normal/Perlu Perhatian)
   - Train-test split (80-20)
   - Feature scaling dengan StandardScaler

3. **Model Training**

   - Baseline Random Forest model
   - Hyperparameter tuning dengan GridSearchCV
   - 5-fold cross-validation

4. **Model Evaluation**

   - Classification report (precision, recall, f1-score)
   - Confusion matrix
   - Feature importance analysis
   - Cross-validation scores

5. **Model Saving**

   - Trained model → `models/trained/water_quality_rf_model.pkl`
   - Scaler → `models/trained/scaler.pkl`
   - Metadata → `models/trained/model_metadata.pkl`

6. **Description Generator**

   - Fungsi untuk generate deskripsi kondisi ikan
   - Rekomendasi tindakan berdasarkan parameter
   - Issue detection (parameter di luar rentang ideal)

7. **Testing**
   - Test dengan 3 contoh kasus:
     - Air BAIK (optimal)
     - Air NORMAL
     - Air PERLU PERHATIAN (buruk)

## 🚀 How to Use

### 1. Setup Environment

```bash
# Activate virtual environment
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Jupyter
pip install jupyter notebook ipykernel
```

### 2. Start Jupyter Notebook

```bash
# From ml-service directory
jupyter notebook
```

Browser akan otomatis terbuka. Navigate ke `notebooks/` dan buka `water_quality_model_training.ipynb`.

### 3. Run the Notebook

**Option 1: Run All Cells**

- Menu → Cell → Run All
- Atau tekan `Shift + Enter` untuk run cell by cell

**Option 2: Run from Command Line**

```bash
jupyter nbconvert --to notebook --execute water_quality_model_training.ipynb
```

### 4. Check Output

Setelah training selesai, cek folder `models/trained/`:

```
models/trained/
├── water_quality_rf_model.pkl    # Trained model
├── scaler.pkl                     # StandardScaler
└── model_metadata.pkl             # Model info & metrics
```

## 📊 Expected Results

Berdasarkan training dengan dataset yang ada, model seharusnya mencapai:

- **Accuracy**: ~95-99%
- **Precision**: ~95-99%
- **Recall**: ~95-99%
- **F1-Score**: ~95-99%

_Note: Actual results may vary depending on the dataset._

## 🔧 Troubleshooting

### Error: Module not found

```bash
pip install -r ../requirements.txt
```

### Kernel not found

```bash
python -m ipykernel install --user --name=nilasense-ml
```

Lalu di Jupyter: Kernel → Change kernel → nilasense-ml

### Memory Error

Jika dataset terlalu besar:

- Gunakan sample data lebih kecil
- Reduce GridSearchCV parameter combinations
- Increase system RAM atau use Google Colab

### Model files not saved

Check permissions pada folder `models/trained/` dan pastikan folder exists.

## 📝 Notes for Development

### Modifying Hyperparameters

Edit cell dengan `param_grid`:

```python
param_grid = {
    'n_estimators': [100, 200],      # Reduce untuk faster training
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt']
}
```

### Adding New Features

1. Update feature selection cell
2. Update `feature_names` list
3. Retrain model
4. Update `utils/model_utils.py` accordingly

### Changing Classes

Jika ingin ubah klasifikasi (misal: 4 kelas):

1. Update `label_mapping` dictionary
2. Adjust description generator logic
3. Retrain model

## 🔗 Integration

Setelah model trained, integrate ke Flask API:

1. Model otomatis available di `models/trained/`
2. Flask app akan load model via `utils/model_utils.py`
3. API endpoint `/api/predict` akan menggunakan model ini

## 👥 Contributors

- Ahmad Faris AL Aziz (J0404231081)
- Bramantyo Wicaksono (J0404231053)
- M Faza Elrahman (J0404231155)

## 📚 References

- Random Forest: https://scikit-learn.org/stable/modules/ensemble.html#forest
- Water Quality Standards for Tilapia
- IoT Sensor Calibration Guidelines
