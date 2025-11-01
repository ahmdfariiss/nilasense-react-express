/**
 * Test script to check ML Service connection
 */
require("dotenv").config();
const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5002";

console.log("=".repeat(50));
console.log("🧪 Testing ML Service Connection");
console.log("=".repeat(50));
console.log(`ML Service URL: ${ML_SERVICE_URL}\n`);

async function testConnection() {
  // Test 1: Health Check
  console.log("1️⃣ Testing Health Check...");
  try {
    const healthResponse = await axios.get(`${ML_SERVICE_URL}/api/health`, {
      timeout: 5000,
    });
    console.log("✅ Health Check: OK");
    console.log(
      `   Response: ${JSON.stringify(healthResponse.data, null, 2)}\n`
    );
  } catch (error) {
    console.log("❌ Health Check: FAILED");
    if (error.code === "ECONNREFUSED") {
      console.log("   Error: Cannot connect to ML Service");
      console.log("   → Is ML Service running?");
      console.log(`   → Check if service is running at ${ML_SERVICE_URL}`);
    } else {
      console.log(`   Error: ${error.message}\n`);
    }
    return;
  }

  // Test 2: Prediction
  console.log("2️⃣ Testing Prediction...");
  try {
    const predictionResponse = await axios.post(
      `${ML_SERVICE_URL}/api/predict`,
      {
        ph: 7.2,
        temperature: 28.5,
        turbidity: 15.3,
        dissolved_oxygen: 6.8,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Prediction: OK");
    console.log(
      `   Quality: ${predictionResponse.data.data?.quality || "N/A"}`
    );
    console.log(
      `   Confidence: ${predictionResponse.data.data?.confidence || "N/A"}\n`
    );
  } catch (error) {
    console.log("❌ Prediction: FAILED");
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response: ${JSON.stringify(error.response.data)}\n`);
    }
  }

  console.log("=".repeat(50));
  console.log("✅ Test Complete!");
  console.log("=".repeat(50));
}

testConnection();

