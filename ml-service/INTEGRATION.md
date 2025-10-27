# Integrasi ML Service dengan Backend Express.js

## 📋 Overview

Dokumen ini menjelaskan cara mengintegrasikan Flask ML Service dengan Backend Express.js NilaSense.

## 🔗 Architecture

```
Frontend (React) → Backend (Express.js) → ML Service (Flask)
                                       ↓
                                   Database
```

## 📡 Integration Steps

### 1. Setup ML Service

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
python run.py
```

ML Service akan berjalan di: `http://localhost:5000`

### 2. Tambahkan ML Service Client di Backend

Buat file baru: `backend/services/mlService.js`

```javascript
const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5000";

class MLService {
  /**
   * Predict water quality dari sensor data
   */
  async predictWaterQuality(sensorData) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/predict`,
        {
          ph: sensorData.ph,
          temperature: sensorData.temperature,
          turbidity: sensorData.turbidity,
          dissolved_oxygen: sensorData.dissolved_oxygen,
          pond_id: sensorData.pond_id,
        },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("ML Service Error:", error.message);
      return {
        success: false,
        error: error.message,
        // Fallback to rule-based if ML service unavailable
        fallback: true,
      };
    }
  }

  /**
   * Batch prediction untuk multiple readings
   */
  async predictBatch(readings) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/predict/batch`,
        { readings },
        { timeout: 30000 }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("ML Batch Prediction Error:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check ML service health
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/api/health`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      return { status: "unhealthy", error: error.message };
    }
  }
}

module.exports = new MLService();
```

### 3. Update Monitoring Controller

Edit file: `backend/controllers/monitoringController.js`

```javascript
const mlService = require("../services/mlService");

// Tambahkan di function addWaterQualityData
exports.addWaterQualityData = async (req, res) => {
  try {
    const { pond_id, ph, temperature, turbidity, dissolved_oxygen } = req.body;

    // ... validasi existing code ...

    // Get AI prediction
    const prediction = await mlService.predictWaterQuality({
      ph,
      temperature,
      turbidity,
      dissolved_oxygen,
      pond_id,
    });

    let quality_status = "Normal";
    let ai_description = null;

    if (prediction.success) {
      quality_status = prediction.data.quality;
      ai_description = prediction.data.description;

      // Optional: Store AI confidence and recommendations
      console.log("AI Prediction:", {
        quality: prediction.data.quality,
        confidence: prediction.data.prediction_confidence,
        recommendations: prediction.data.recommendations,
      });
    }

    // Insert ke database dengan quality_status dari AI
    const query = `
      INSERT INTO water_quality 
      (pond_id, ph, temperature, turbidity, dissolved_oxygen, quality_status, ai_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      pond_id,
      ph,
      temperature,
      turbidity,
      dissolved_oxygen,
      quality_status,
      ai_description,
    ];
    const result = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: "Water quality data added successfully",
      data: result.rows[0],
      ai_prediction: prediction.success ? prediction.data : null,
    });
  } catch (error) {
    console.error("Error adding water quality data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add water quality data",
    });
  }
};
```

### 4. Update Database Schema

Tambahkan kolom baru di tabel `water_quality`:

```sql
-- Migration: Add AI prediction columns
ALTER TABLE water_quality
ADD COLUMN IF NOT EXISTS ai_description TEXT,
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS ai_recommendations JSONB;
```

Atau buat migration file baru: `backend/database/migrations/007_add_ai_columns.sql`

### 5. Update Environment Variables

Edit `backend/.env`:

```env
# ML Service Configuration
ML_SERVICE_URL=http://localhost:5000
ML_SERVICE_ENABLED=true
ML_SERVICE_TIMEOUT=10000
```

### 6. Tambahkan Endpoint untuk Manual Prediction

Edit `backend/routes/monitoringRoutes.js`:

```javascript
// Get AI prediction without saving
router.post("/predict", authMiddleware, async (req, res) => {
  try {
    const prediction = await mlService.predictWaterQuality(req.body);

    if (prediction.success) {
      res.json({
        success: true,
        data: prediction.data,
      });
    } else {
      res.status(500).json({
        success: false,
        error: prediction.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check ML service
router.get("/ml/health", authMiddleware, async (req, res) => {
  const health = await mlService.healthCheck();
  res.json(health);
});
```

## 🧪 Testing Integration

### Test dari Backend

```bash
# Di terminal backend
cd backend
node -e "
  const mlService = require('./services/mlService');
  mlService.predictWaterQuality({
    ph: 7.2,
    temperature: 28.5,
    turbidity: 15.3,
    dissolved_oxygen: 6.8,
    pond_id: 1
  }).then(result => console.log(JSON.stringify(result, null, 2)));
"
```

### Test dengan curl

```bash
# Test ML Service directly
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "ph": 7.2,
    "temperature": 28.5,
    "turbidity": 15.3,
    "dissolved_oxygen": 6.8
  }'

# Test through Backend
curl -X POST http://localhost:3000/api/monitoring/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ph": 7.2,
    "temperature": 28.5,
    "turbidity": 15.3,
    "dissolved_oxygen": 6.8,
    "pond_id": 1
  }'
```

## 🎯 Frontend Integration

Update monitoring service di frontend untuk menampilkan AI prediction:

```javascript
// frontend/src/services/monitoringService.js

export const getAIPrediction = async (sensorData) => {
  try {
    const response = await api.post("/api/monitoring/predict", sensorData);
    return response.data;
  } catch (error) {
    console.error("Error getting AI prediction:", error);
    throw error;
  }
};
```

Tampilkan di UI:

```jsx
// frontend/src/pages/admin/WaterMonitoringPage.jsx

{
  latestData.ai_description && (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Kualitas:</span>
            <Badge className={getQualityBadgeClass(latestData.quality_status)}>
              {latestData.quality_status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {latestData.ai_description}
          </p>
          {latestData.ai_recommendations && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Rekomendasi:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {latestData.ai_recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🚀 Deployment

### Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - ML Service
cd ml-service
source venv/bin/activate
python run.py

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### Production

1. **ML Service** - Deploy ke server dengan gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

2. **Backend** - Update ML_SERVICE_URL ke production URL

3. **Consider**:
   - Load balancer untuk ML service
   - Redis untuk caching predictions
   - Monitoring & alerting

## 📊 Monitoring

Log semua predictions untuk analysis:

```javascript
// backend/services/mlService.js
async predictWaterQuality(sensorData) {
  const startTime = Date.now();
  const result = await // ... prediction code
  const duration = Date.now() - startTime;

  console.log('ML Prediction:', {
    duration,
    quality: result.data?.quality,
    confidence: result.data?.prediction_confidence,
    timestamp: new Date().toISOString()
  });

  return result;
}
```

## 🔐 Security

- Tambahkan API key authentication antara backend dan ML service
- Rate limiting untuk prevent abuse
- Input validation di kedua sisi
- HTTPS untuk production

## ❓ Troubleshooting

**ML Service tidak respond:**

```bash
# Check ML service status
curl http://localhost:5000/api/health

# Check logs
tail -f ml-service/logs/app.log
```

**Connection refused:**

- Pastikan ML service running
- Check firewall settings
- Verify port 5000 available

**Slow predictions:**

- Implement caching
- Optimize model
- Use batch predictions

## 📚 Resources

- Flask Documentation: https://flask.palletsprojects.com/
- scikit-learn: https://scikit-learn.org/
- Model deployment best practices
