# 🔧 Troubleshooting - NilaSense ML Service

## Masalah yang Sering Terjadi

### 1. ⚠️ Warning: InconsistentVersionWarning (scikit-learn)

**Gejala:**

```
InconsistentVersionWarning: Trying to unpickle estimator RandomForestClassifier
from version 1.5.2 when using version 1.7.2.
```

**Penyebab:**
Model dibuat dengan scikit-learn versi 1.5.2, tetapi sistem saat ini menggunakan versi 1.7.2.

**Solusi:**

- **Opsi 1 (Direkomendasikan):** Re-train model dengan versi scikit-learn terbaru

  ```bash
  cd ml-service
  python models/training/train_model.py
  ```

  atau gunakan Jupyter Notebook:

  ```bash
  jupyter notebook notebooks/water_quality_model_training.ipynb
  ```

- **Opsi 2:** Warning ini sudah di-suppress secara otomatis dan tidak akan mempengaruhi fungsi prediksi. Model masih dapat digunakan dengan baik karena scikit-learn menjaga backward compatibility.

**Catatan:** Warning ini tidak akan menghentikan aplikasi. Model tetap berfungsi dengan baik.

---

### 2. ❌ Error: 'model_type' key tidak ditemukan

**Gejala:**

```
❌ Error loading model: 'model_type'
```

**Penyebab:**
Metadata model menggunakan format lama yang tidak memiliki field `model_type`.

**Solusi:**
Sudah diperbaiki! Kode sekarang otomatis mendukung kedua format metadata:

- Format lama: `test_accuracy`, `test_precision`, `test_recall`, `test_f1`
- Format baru: `accuracy`, `precision`, `recall`, `f1_score`

Jika error masih terjadi, pastikan file metadata ada di `models/trained/model_metadata.pkl`.

---

### 3. ❌ Error: Model files not found

**Gejala:**

```
❌ Error: Model files not found in models/trained
```

**Penyebab:**
File model belum di-generate atau tidak ada di lokasi yang benar.

**Solusi:**

1. Pastikan file berikut ada:

   - `models/trained/water_quality_rf_model.pkl`
   - `models/trained/scaler.pkl`
   - `models/trained/model_metadata.pkl` (opsional)

2. Jika file tidak ada, jalankan training:

   ```bash
   cd ml-service
   python models/training/train_model.py
   ```

3. Atau gunakan Jupyter Notebook:
   ```bash
   jupyter notebook notebooks/water_quality_model_training.ipynb
   ```

---

### 4. ⚠️ Model menggunakan fallback rule-based prediction

**Gejala:**

```
⚠️  Model prediction failed: [error message]
   Using fallback rule-based classification...
```

**Penyebab:**
Model ML tidak dapat di-load atau terjadi error saat prediksi.

**Solusi:**

1. Check apakah model files ada (lihat masalah #3)
2. Check log error untuk detail masalah
3. Fallback rule-based prediction akan tetap bekerja, tetapi akurasinya lebih rendah daripada ML model

---

### 5. 🔌 Port sudah digunakan

**Gejala:**

```
OSError: [Errno 48] Address already in use
```

**Penyebab:**
Port 5002 (atau port yang dikonfigurasi) sudah digunakan oleh proses lain.

**Solusi:**

1. **Windows:**

   ```bash
   netstat -ano | findstr :5002
   taskkill /PID <PID> /F
   ```

2. **Linux/Mac:**

   ```bash
   lsof -i :5002
   kill -9 <PID>
   ```

3. Atau gunakan port lain dengan mengubah `.env`:
   ```env
   FLASK_PORT=5003
   ```

---

### 6. 📦 Module not found

**Gejala:**

```
ModuleNotFoundError: No module named 'flask'
```

**Penyebab:**
Dependencies belum di-install atau virtual environment tidak aktif.

**Solusi:**

1. Pastikan virtual environment aktif:

   ```bash
   # Windows
   venv\Scripts\activate

   # Linux/Mac
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Tips & Best Practices

### 1. Re-train Model secara Berkala

- Re-train model setiap kali ada data baru
- Gunakan versi scikit-learn terbaru untuk menghindari warning
- Backup model lama sebelum re-train

### 2. Monitor Logs

- Check log file di `logs/app.log` (jika ada)
- Monitor console output untuk warnings dan errors
- Setup logging untuk production

### 3. Testing

- Test API dengan `test_service.py`:
  ```bash
  python test_service.py
  ```
- Test prediction dengan `test_prediction.py`:
  ```bash
  python test_prediction.py
  ```

### 4. Backup Model

- Backup model files sebelum update:
  ```bash
  tar -czf models_backup_$(date +%Y%m%d).tar.gz models/trained/
  ```

---

## Masalah Lainnya?

Jika masalah tidak tercantum di atas, silakan:

1. Check log error dengan detail
2. Pastikan semua dependencies terinstall
3. Pastikan Python version >= 3.8
4. Contact tim pengembang

---

**Last Updated:** 2024
