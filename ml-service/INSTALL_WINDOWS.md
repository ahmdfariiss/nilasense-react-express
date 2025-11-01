# Instalasi ML Service di Windows

## 🔧 Masalah: Microsoft Visual C++ Build Tools Required

Jika Anda mendapat error:

```
distutils.errors.DistutilsPlatformError: Microsoft Visual C++ 14.0 or greater is required
```

Ini terjadi karena `scikit-learn==1.3.2` tidak memiliki pre-built wheels untuk Windows dan perlu dikompilasi.

## ✅ Solusi 1: Gunakan Versi Terbaru (RECOMMENDED)

File `requirements.txt` sudah diupdate untuk menggunakan versi yang memiliki pre-built wheels:

```bash
# Di folder ml-service, dengan virtual environment aktif
pip install --upgrade pip
pip install -r requirements.txt
```

## ✅ Solusi 2: Install Microsoft Visual C++ Build Tools

Jika masih ingin menggunakan versi lama, install build tools:

1. Download dan install: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Pilih "Desktop development with C++" workload
3. Install (sekitar 6GB)
4. Restart terminal
5. Jalankan `pip install -r requirements.txt` lagi

## ✅ Solusi 3: Install Minimal Dependencies

Jika hanya butuh untuk menjalankan service (tanpa training model):

```bash
pip install Flask==3.0.0 Flask-CORS==4.0.0 python-dotenv==1.0.0 requests==2.31.0 joblib==1.3.2 scikit-learn pandas numpy
```

Pip akan otomatis memilih versi terbaru yang kompatibel dengan Windows.

## 🚀 Langkah Instalasi (Setelah Fix)

```bash
# 1. Pastikan virtual environment aktif
venv\Scripts\activate

# 2. Upgrade pip
python -m pip install --upgrade pip

# 3. Install dependencies
pip install -r requirements.txt

# 4. Verifikasi instalasi
python -c "import sklearn; print(f'scikit-learn version: {sklearn.__version__}')"
```

## 📝 Catatan

- Versi scikit-learn >= 1.4.0 sudah memiliki pre-built wheels untuk Windows
- Tidak perlu Microsoft Visual C++ Build Tools jika menggunakan versi terbaru
- Jika masih error, coba install package satu per satu untuk melihat yang bermasalah

