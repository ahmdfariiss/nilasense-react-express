const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5002";

// Log ML Service URL on startup
console.log(`🔗 ML Service configured at: ${ML_SERVICE_URL}`);

class MLService {
  /**
   * Predict water quality dari sensor data
   */
  async predictWaterQuality(sensorData) {
    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/api/predict`,
        {
          ph: sensorData.ph || sensorData.ph_level,
          temperature: sensorData.temperature,
          turbidity: sensorData.turbidity,
          dissolved_oxygen:
            sensorData.dissolved_oxygen || sensorData.dissolved_oxygen,
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
      // Log detailed error for debugging
      if (error.code === "ECONNREFUSED") {
        console.error(
          `❌ ML Service Error: Cannot connect to ${ML_SERVICE_URL}`
        );
        console.error(`   Error: Connection refused. Is ML Service running?`);
      } else if (error.code === "ETIMEDOUT") {
        console.error(
          `❌ ML Service Error: Request timeout to ${ML_SERVICE_URL}`
        );
        console.error(`   Error: ML Service took too long to respond`);
      } else {
        console.error(`❌ ML Service Error: ${error.message}`);
        console.error(`   URL: ${ML_SERVICE_URL}/api/predict`);
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
          console.error(`   Response: ${JSON.stringify(error.response.data)}`);
        }
      }
      return {
        success: false,
        error: error.message,
        errorCode: error.code,
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
