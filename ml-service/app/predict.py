"""
Machine Learning Prediction Logic
"""
import os
import joblib
import numpy as np
from datetime import datetime
from utils.model_utils import get_model_instance


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
    Predict water quality from sensor data using trained ML model
    
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
        
        # Try to use trained ML model
        try:
            model = get_model_instance()
            
            # Use trained model for prediction
            result = model.predict(
                ph=ph,
                temperature=temperature,
                turbidity=turbidity,
                dissolved_oxygen=dissolved_oxygen
            )
            
            # Add timestamp
            result['timestamp'] = datetime.utcnow().isoformat() + 'Z'
            result['model_used'] = 'Random Forest Classifier'
            
            return result
            
        except Exception as model_error:
            # Fallback to rule-based classification if model fails
            print(f"⚠️  Model prediction failed: {model_error}")
            print("   Using fallback rule-based classification...")
            
            return _fallback_prediction(ph, temperature, turbidity, dissolved_oxygen)
        
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")


def _fallback_prediction(ph, temperature, turbidity, dissolved_oxygen):
    """
    Fallback rule-based classification when ML model is not available
    Uses the same logic as model_utils._generate_description for consistency
    
    Args:
        ph, temperature, turbidity, dissolved_oxygen: Water parameters
        
    Returns:
        dict: Prediction result
    """
    # Use the same logic as model_utils for consistency
    IDEAL_PH_MIN, IDEAL_PH_MAX = 6.5, 8.5
    IDEAL_TEMP_MIN, IDEAL_TEMP_MAX = 25, 30
    IDEAL_TURBIDITY_MAX = 25
    IDEAL_DO_MIN = 5.0
    
    # Initialize issues and recommendations (same as model_utils)
    issues = []
    recommendations = []
    
    # Check pH
    if ph < 6.0:
        issues.append("pH terlalu rendah (asam)")
        recommendations.append("Tambahkan kapur pertanian untuk menaikkan pH")
    elif ph > 9.0:
        issues.append("pH terlalu tinggi (basa)")
        recommendations.append("Lakukan pergantian air secara bertahap")
    elif ph < IDEAL_PH_MIN or ph > IDEAL_PH_MAX:
        issues.append("pH di luar rentang optimal")
        recommendations.append("Monitor pH secara rutin dan lakukan penyesuaian bertahap")
    
    # Check Temperature
    if temperature < 20:
        issues.append("suhu terlalu rendah")
        recommendations.append("Pertimbangkan penggunaan pemanas air atau greenhouse")
    elif temperature > 32:
        issues.append("suhu terlalu tinggi")
        recommendations.append("Tingkatkan aerasi dan pertimbangkan peneduh kolam")
    elif temperature < IDEAL_TEMP_MIN or temperature > IDEAL_TEMP_MAX:
        issues.append("suhu di luar rentang optimal")
        recommendations.append("Monitor suhu dan sesuaikan dengan kondisi lingkungan")
    
    # Check Turbidity
    if turbidity > 50:
        issues.append("kekeruhan sangat tinggi")
        recommendations.append("Kurangi pemberian pakan dan tingkatkan filtrasi air")
    elif turbidity > IDEAL_TURBIDITY_MAX:
        issues.append("kekeruhan cukup tinggi")
        recommendations.append("Lakukan penggantian air parsial dan periksa sistem filtrasi")
    
    # Check Dissolved Oxygen
    if dissolved_oxygen < 3.0:
        issues.append("oksigen terlarut sangat rendah (berbahaya)")
        recommendations.append("SEGERA tingkatkan aerasi dan kurangi kepadatan ikan")
    elif dissolved_oxygen < IDEAL_DO_MIN:
        issues.append("oksigen terlarut di bawah ideal")
        recommendations.append("Tingkatkan aerasi dengan aerator atau kincir air")
    
    # Rule-based scoring for quality determination
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
    
    # Determine quality based on score
    if score >= 80:
        quality = 'Baik'
        confidence = min(0.95 + (score - 80) / 20 * 0.05, 0.99)  # 0.95-0.99
    elif score >= 60:
        quality = 'Normal'
        confidence = 0.75 + (score - 60) / 20 * 0.10  # 0.75-0.85
    else:
        quality = 'Perlu Perhatian'
        confidence = 0.85 + (score / 60) * 0.05  # 0.85-0.90
    
    # Calculate probabilities based on score (more realistic distribution)
    if quality == 'Baik':
        prob_baik = confidence
        prob_normal = (1 - prob_baik) * 0.6
        prob_perhatian = (1 - prob_baik) * 0.4
    elif quality == 'Normal':
        prob_normal = confidence
        prob_baik = (1 - prob_normal) * 0.3
        prob_perhatian = (1 - prob_normal) * 0.7
    else:  # Perlu Perhatian
        prob_perhatian = confidence
        prob_baik = (1 - prob_perhatian) * 0.2
        prob_normal = (1 - prob_perhatian) * 0.8
    
    # Normalize probabilities
    total_prob = prob_baik + prob_normal + prob_perhatian
    prob_baik = prob_baik / total_prob
    prob_normal = prob_normal / total_prob
    prob_perhatian = prob_perhatian / total_prob
    
    # Generate description based on quality (same format as model_utils)
    if quality == 'Baik':
        description = (
            f"Kualitas air dalam kondisi OPTIMAL untuk budidaya ikan nila. "
            f"Parameter pH ({ph:.2f}), suhu ({temperature:.1f}°C), kekeruhan ({turbidity:.1f} NTU), "
            f"dan oksigen terlarut ({dissolved_oxygen:.2f} mg/L) berada dalam rentang ideal. "
            f"Ikan nila dapat tumbuh dengan sehat, memiliki nafsu makan yang baik, dan sistem imun yang kuat. "
            f"Pertumbuhan ikan optimal dengan tingkat stres minimal."
        )
        if not recommendations:
            recommendations.extend([
                "Pertahankan kualitas air saat ini",
                "Lakukan monitoring rutin setiap hari",
                "Berikan pakan berkualitas sesuai jadwal"
            ])
    
    elif quality == 'Normal':
        description = (
            f"Kualitas air dalam kondisi CUKUP BAIK untuk budidaya ikan nila. "
            f"Terdapat beberapa parameter yang perlu diperhatikan: {', '.join(issues) if issues else 'parameter masih dalam batas toleransi'}. "
            f"Ikan nila masih dapat bertahan dan tumbuh, namun mungkin mengalami sedikit stres. "
            f"Nafsu makan ikan bisa menurun dan pertumbuhan tidak seoptimal kondisi ideal. "
            f"Sistem kekebalan tubuh ikan mulai menurun, sehingga lebih rentan terhadap penyakit."
        )
        if not recommendations:
            recommendations.extend([
                "Monitor parameter air lebih sering (2-3x sehari)",
                "Siapkan rencana perbaikan kualitas air",
                "Kurangi pemberian pakan jika ikan terlihat lemas"
            ])
    
    else:  # Perlu Perhatian
        description = (
            f"Kualitas air dalam kondisi BURUK dan MEMERLUKAN TINDAKAN SEGERA! "
            f"Masalah yang terdeteksi: {', '.join(issues) if issues else 'beberapa parameter di luar batas toleransi'}. "
            f"Dalam kondisi air seperti ini, ikan nila mengalami STRES BERAT dan kesehatan mereka terancam. "
            f"Ikan akan menunjukkan gejala: nafsu makan menurun drastis atau tidak mau makan, "
            f"bergerak lemah di permukaan air (gasping), warna tubuh memucat, "
            f"sangat rentan terhadap penyakit dan infeksi, pertumbuhan terhenti, "
            f"dan dapat menyebabkan KEMATIAN MASSAL jika tidak segera ditangani."
        )
        if not recommendations:
            recommendations.extend([
                "SEGERA lakukan pergantian air 30-50%",
                "Hentikan pemberian pakan sementara",
                "Tingkatkan aerasi secara maksimal"
            ])
        recommendations.append("Konsultasi dengan ahli budidaya ikan jika kondisi tidak membaik")
    
    # Prepare result
    result = {
        'quality': quality,
        'description': description,
        'parameters': {
            'ph': ph,
            'temperature': temperature,
            'turbidity': turbidity,
            'dissolved_oxygen': dissolved_oxygen
        },
        'recommendations': recommendations,
        'confidence': round(confidence, 4),
        'score': score,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'model_used': 'Rule-based (Fallback)',
        'issues': issues if issues else ['Tidak ada masalah signifikan'],
        'probabilities': {
            'Baik': round(prob_baik, 4),
            'Normal': round(prob_normal, 4),
            'Perlu Perhatian': round(prob_perhatian, 4)
        }
    }
    
    return result


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

