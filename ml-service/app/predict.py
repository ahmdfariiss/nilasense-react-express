"""
Machine Learning Prediction Logic
"""
import os
import joblib
import numpy as np
from datetime import datetime

# TODO: Load actual trained model
# model = joblib.load(os.getenv('MODEL_PATH', 'models/trained/water_quality_model.pkl'))
# scaler = joblib.load(os.getenv('SCALER_PATH', 'models/trained/scaler.pkl'))


def get_water_quality_description(quality, parameters):
    """
    Generate description based on water quality prediction
    
    Args:
        quality: str ('Baik', 'Normal', 'Buruk')
        parameters: dict with pH, temperature, turbidity, dissolved_oxygen
        
    Returns:
        str: Description of water quality and fish condition
    """
    descriptions = {
        'Baik': {
            'water': 'Kualitas air dalam kondisi optimal untuk budidaya ikan nila.',
            'fish': 'Ikan dalam kondisi sehat dan pertumbuhan optimal.',
            'params': 'Parameter pH, suhu, dan oksigen terlarut berada dalam rentang ideal.'
        },
        'Normal': {
            'water': 'Kualitas air masih dalam batas normal namun perlu perhatian.',
            'fish': 'Kondisi ikan relatif baik, namun perlu monitoring lebih ketat.',
            'params': 'Beberapa parameter mendekati batas toleransi.'
        },
        'Buruk': {
            'water': 'Kualitas air berada di bawah standar optimal.',
            'fish': 'Kondisi ikan berpotensi stres dan pertumbuhan terhambat.',
            'params': 'Parameter air di luar rentang ideal dan memerlukan perbaikan segera.'
        }
    }
    
    desc = descriptions.get(quality, descriptions['Normal'])
    
    return f"{desc['water']} {desc['params']} {desc['fish']}"


def get_recommendations(quality, parameters):
    """
    Generate recommendations based on water quality
    
    Args:
        quality: str ('Baik', 'Normal', 'Buruk')
        parameters: dict with sensor readings
        
    Returns:
        list: List of recommendations
    """
    recommendations = []
    
    # Check pH
    if parameters['ph'] < 6.5:
        recommendations.append("pH terlalu rendah - tambahkan kapur atau buffer pH")
    elif parameters['ph'] > 8.5:
        recommendations.append("pH terlalu tinggi - lakukan penggantian air sebagian")
    
    # Check temperature
    if parameters['temperature'] < 25:
        recommendations.append("Suhu terlalu rendah - pertimbangkan sistem pemanas")
    elif parameters['temperature'] > 32:
        recommendations.append("Suhu terlalu tinggi - tingkatkan aerasi dan pertimbangkan pendinginan")
    
    # Check dissolved oxygen
    if parameters['dissolved_oxygen'] < 4:
        recommendations.append("Oksigen terlarut rendah - tingkatkan aerasi segera")
    
    # Check turbidity
    if parameters['turbidity'] > 30:
        recommendations.append("Kekeruhan tinggi - lakukan filtrasi atau ganti air sebagian")
    
    # Default recommendations
    if quality == 'Baik':
        recommendations.extend([
            "Pertahankan kualitas air saat ini",
            "Monitor secara berkala setiap 2-3 jam"
        ])
    elif quality == 'Normal':
        recommendations.extend([
            "Monitor lebih sering setiap 1-2 jam",
            "Siapkan langkah perbaikan jika kondisi memburuk"
        ])
    else:  # Buruk
        recommendations.extend([
            "Lakukan tindakan perbaikan segera",
            "Monitor kontinyu hingga kondisi membaik",
            "Pertimbangkan konsultasi dengan ahli akuakultur"
        ])
    
    return recommendations


def predict_water_quality(sensor_data):
    """
    Predict water quality from sensor data
    
    Args:
        sensor_data: dict with keys: ph, temperature, turbidity, dissolved_oxygen
        
    Returns:
        dict: Prediction result with quality, description, and recommendations
    """
    try:
        # Extract parameters
        ph = float(sensor_data['ph'])
        temperature = float(sensor_data['temperature'])
        turbidity = float(sensor_data['turbidity'])
        dissolved_oxygen = float(sensor_data['dissolved_oxygen'])
        
        # TODO: Replace with actual ML model prediction
        # For now, use rule-based classification
        
        # Rule-based classification (temporary until model is trained)
        score = 0
        
        # pH scoring (ideal: 6.5-8.5)
        if 6.5 <= ph <= 8.5:
            score += 25
        elif 6.0 <= ph < 6.5 or 8.5 < ph <= 9.0:
            score += 15
        else:
            score += 0
        
        # Temperature scoring (ideal: 25-30°C)
        if 25 <= temperature <= 30:
            score += 25
        elif 22 <= temperature < 25 or 30 < temperature <= 32:
            score += 15
        else:
            score += 0
        
        # Turbidity scoring (ideal: < 25 NTU)
        if turbidity < 25:
            score += 25
        elif 25 <= turbidity < 40:
            score += 15
        else:
            score += 0
        
        # Dissolved Oxygen scoring (ideal: > 5 mg/L)
        if dissolved_oxygen >= 5:
            score += 25
        elif 4 <= dissolved_oxygen < 5:
            score += 15
        else:
            score += 0
        
        # Determine quality
        if score >= 80:
            quality = 'Baik'
            confidence = 0.95
        elif score >= 60:
            quality = 'Normal'
            confidence = 0.85
        else:
            quality = 'Buruk'
            confidence = 0.90
        
        # Generate description and recommendations
        parameters = {
            'ph': ph,
            'temperature': temperature,
            'turbidity': turbidity,
            'dissolved_oxygen': dissolved_oxygen
        }
        
        description = get_water_quality_description(quality, parameters)
        recommendations = get_recommendations(quality, parameters)
        
        # Prepare result
        result = {
            'quality': quality,
            'description': description,
            'parameters': parameters,
            'recommendations': recommendations,
            'prediction_confidence': confidence,
            'score': score,
            'timestamp': datetime.utcnow().isoformat() + 'Z'
        }
        
        return result
        
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")


def predict_batch(readings):
    """
    Batch prediction for multiple sensor readings
    
    Args:
        readings: list of dicts with sensor data
        
    Returns:
        list: List of prediction results
    """
    results = []
    
    for reading in readings:
        try:
            result = predict_water_quality(reading)
            results.append(result)
        except Exception as e:
            results.append({
                'error': str(e),
                'parameters': reading
            })
    
    return results

