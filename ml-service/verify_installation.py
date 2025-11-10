#!/usr/bin/env python3
"""
Script untuk verifikasi instalasi dependencies ML Service
"""

print("=" * 50)
print("🔍 Verifikasi Instalasi ML Service")
print("=" * 50)

errors = []
success = []

# Test imports
packages_to_test = {
    "Flask": "flask",
    "Flask-CORS": "flask_cors",
    "scikit-learn": "sklearn",
    "pandas": "pandas",
    "numpy": "numpy",
    "joblib": "joblib",
    "pydantic": "pydantic",
    "requests": "requests",
    "python-dotenv": "dotenv",
    "python-json-logger": "pythonjsonlogger",
}

print("\n📦 Testing package imports...")
for name, module in packages_to_test.items():
    try:
        __import__(module)
        success.append(name)
        print(f"✅ {name}")
    except ImportError as e:
        errors.append(f"{name}: {str(e)}")
        print(f"❌ {name}: {str(e)}")

# Test version info
print("\n📊 Package versions:")
try:
    import flask
    import sklearn
    import pandas
    import numpy
    print(f"   Flask: {flask.__version__}")
    print(f"   scikit-learn: {sklearn.__version__}")
    print(f"   pandas: {pandas.__version__}")
    print(f"   numpy: {numpy.__version__}")
except Exception as e:
    print(f"   ⚠️  Could not get version info: {e}")

# Test model utilities
print("\n🤖 Testing model utilities...")
try:
    from utils.model_utils import get_model_instance
    print("✅ Model utilities can be imported")
    try:
        model = get_model_instance()
        print("✅ Model instance created successfully")
    except Exception as e:
        print(f"⚠️  Model instance creation: {str(e)}")
        print("   (This is OK if model files are not yet trained)")
except ImportError as e:
    print(f"⚠️  Model utilities import: {str(e)}")

# Test Flask app
print("\n🌐 Testing Flask app creation...")
try:
    from app import create_app
    app = create_app()
    print("✅ Flask app created successfully")
except Exception as e:
    print(f"❌ Flask app creation failed: {str(e)}")
    errors.append(f"Flask app: {str(e)}")

# Summary
print("\n" + "=" * 50)
if len(errors) == 0:
    print("✅ VERIFIKASI BERHASIL!")
    print("   Semua package berhasil diinstall dan dapat diimport.")
    print("\n🚀 Anda dapat menjalankan ML Service dengan:")
    print("   python run.py")
else:
    print(f"⚠️  VERIFIKASI DENGAN PERINGATAN")
    print(f"   {len(errors)} error ditemukan:")
    for error in errors:
        print(f"   - {error}")
    print("\n   Beberapa package mungkin perlu diinstall ulang.")

print("=" * 50)















