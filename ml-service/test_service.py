#!/usr/bin/env python3
"""
Quick test untuk ML Service
"""
import requests
import json

ML_SERVICE_URL = "http://localhost:5002"

print("=" * 50)
print("🧪 Testing ML Service")
print("=" * 50)

# Test 1: Health Check
print("\n1. Testing Health Check...")
try:
    response = requests.get(f"{ML_SERVICE_URL}/api/health", timeout=5)
    if response.status_code == 200:
        print("✅ Health Check: OK")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"❌ Health Check failed: {response.status_code}")
except Exception as e:
    print(f"❌ Health Check error: {e}")
    exit(1)

# Test 2: Prediction
print("\n2. Testing Prediction...")
test_data = {
    "ph": 7.2,
    "temperature": 28.5,
    "turbidity": 15.3,
    "dissolved_oxygen": 6.8
}

try:
    response = requests.post(
        f"{ML_SERVICE_URL}/api/predict",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    if response.status_code == 200:
        print("✅ Prediction: OK")
        result = response.json()
        if result.get('success'):
            data = result.get('data', {})
            print(f"   Quality: {data.get('quality', 'N/A')}")
            print(f"   Confidence: {data.get('confidence', 'N/A')}")
            print(f"   Model Used: {data.get('model_used', 'N/A')}")
            if 'issues' in data:
                print(f"   Issues: {len(data['issues'])} found")
            if 'recommendations' in data:
                print(f"   Recommendations: {len(data['recommendations'])} provided")
        else:
            print(f"   Response: {json.dumps(result, indent=2)}")
    else:
        print(f"❌ Prediction failed: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"❌ Prediction error: {e}")

print("\n" + "=" * 50)
print("✅ Testing Complete!")
print("=" * 50)


