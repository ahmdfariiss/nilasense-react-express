# NilaSense ML Service

Flask-based Machine Learning service untuk prediksi kualitas air kolam ikan nila.

## 📋 Deskripsi

Service ini memprediksi kualitas air kolam berdasarkan sensor IoT dengan parameter:

- **pH** (Tingkat keasaman/basa air)
- **Suhu** (Temperature dalam Celsius)
- **Kekeruhan** (Turbidity dalam NTU)
- **Oksigen Terlarut** (Dissolved Oxygen dalam mg/L)

## 🎯 Output Prediksi

1. **Kualitas Air**: Baik, Normal, atau Buruk
2. **Deskripsi**: Analisis singkat kondisi air dan dampaknya terhadap ikan

## 🏗️ Struktur Folder

```
ml-service/
├── app/                    # Flask application
│   ├── __init__.py        # App initialization
│   ├── routes.py          # API endpoints
│   ├── predict.py         # Prediction logic
│   └── validators.py      # Input validation
├── models/                 # ML models
│   ├── trained/           # Trained model files (.pkl, .h5)
│   ├── training/          # Training scripts
│   └── preprocessing/     # Data preprocessing
├── data/                   # Datasets
│   ├── raw/               # Raw sensor data
│   ├── processed/         # Processed data
│   └── samples/           # Sample data for testing
├── tests/                  # Unit tests
│   ├── test_api.py
│   └── test_model.py
├── config/                 # Configuration files
│   ├── config.py          # App configuration
│   └── model_config.json  # Model parameters
├── utils/                  # Utility functions
│   ├── logger.py          # Logging setup
│   └── helpers.py         # Helper functions
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables example
├── .gitignore             # Git ignore file
├── run.py                 # Application entry point
└── README.md              # This file
```

## 🚀 Setup & Installation

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Installation Steps

1. **Create virtual environment**

```bash
python -m venv venv
```

2. **Activate virtual environment**

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Setup environment variables**

```bash
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai
```

5. **Run the application**

```bash
python run.py
```

## 📡 API Endpoints

### 1. Health Check

```
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "NilaSense ML Service",
  "version": "1.0.0"
}
```

### 2. Predict Water Quality

```
POST /api/predict
```

**Request Body:**

```json
{
  "ph": 7.2,
  "temperature": 28.5,
  "turbidity": 15.3,
  "dissolved_oxygen": 6.8,
  "pond_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "quality": "Baik",
    "description": "Kualitas air dalam kondisi optimal untuk budidaya ikan nila. Parameter pH, suhu, dan oksigen terlarut berada dalam rentang ideal. Ikan dalam kondisi sehat dan pertumbuhan optimal.",
    "parameters": {
      "ph": 7.2,
      "temperature": 28.5,
      "turbidity": 15.3,
      "dissolved_oxygen": 6.8
    },
    "recommendations": [
      "Pertahankan kualitas air saat ini",
      "Monitor secara berkala"
    ],
    "prediction_confidence": 0.95,
    "timestamp": "2024-10-26T21:00:00Z"
  }
}
```

### 3. Batch Prediction

```
POST /api/predict/batch
```

**Request Body:**

```json
{
  "readings": [
    {
      "ph": 7.2,
      "temperature": 28.5,
      "turbidity": 15.3,
      "dissolved_oxygen": 6.8
    }
    // ... more readings
  ]
}
```

## 🔧 Configuration

Edit `.env` file:

```env
FLASK_ENV=development
FLASK_PORT=5000
MODEL_PATH=models/trained/water_quality_model.pkl
LOG_LEVEL=INFO
BACKEND_API_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_api.py
```

## 📊 Model Training

```bash
# Train new model
python models/training/train_model.py

# Evaluate model
python models/training/evaluate_model.py
```

## 🔗 Integration dengan Backend

Backend Express.js akan memanggil ML service melalui HTTP:

```javascript
// backend/services/mlService.js
const axios = require("axios");

async function predictWaterQuality(sensorData) {
  const response = await axios.post(
    "http://localhost:5000/api/predict",
    sensorData
  );
  return response.data;
}
```

## 📈 Model Performance

- **Accuracy**: TBD (setelah training)
- **Precision**: TBD
- **Recall**: TBD
- **F1-Score**: TBD

## 🔄 CI/CD

TBD - Setup untuk automated testing dan deployment

## 📝 Logging

Logs disimpan di: `logs/app.log`

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

Copyright © 2024 NilaSense Team

## 👥 Team

- Ahmad Faris AL Aziz (J0404231081) - Full Stack Developer
- Bramantyo Wicaksono (J0404231053) - IoT Designer
- M Faza Elrahman (J0404231155) - Developer

## 📞 Contact

For questions or support, contact the development team.
