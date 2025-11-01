"""
API Routes for ML Service
"""
from flask import Blueprint, request, jsonify
from app.predict import predict_water_quality, predict_batch
from app.validators import validate_sensor_data
from datetime import datetime

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'NilaSense ML Service',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    }), 200


@api_bp.route('/predict', methods=['POST'])
def predict():
    """
    Predict water quality from sensor data
    
    Request Body:
    {
        "ph": 7.2,
        "temperature": 28.5,
        "turbidity": 15.3,
        "dissolved_oxygen": 6.8,
        "pond_id": 1 (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Validate input
        validation = validate_sensor_data(data)
        if not validation['valid']:
            return jsonify({
                'success': False,
                'error': 'Invalid input data',
                'details': validation['errors']
            }), 400
        
        # Make prediction
        result = predict_water_quality(data)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/predict/batch', methods=['POST'])
def predict_batch_endpoint():
    """
    Batch prediction for multiple sensor readings
    
    Request Body:
    {
        "readings": [
            {
                "ph": 7.2,
                "temperature": 28.5,
                "turbidity": 15.3,
                "dissolved_oxygen": 6.8
            },
            // ... more readings
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'readings' not in data:
            return jsonify({
                'success': False,
                'error': 'No readings provided'
            }), 400
        
        readings = data['readings']
        
        if not isinstance(readings, list):
            return jsonify({
                'success': False,
                'error': 'Readings must be an array'
            }), 400
        
        # Make batch predictions
        results = predict_batch(readings)
        
        return jsonify({
            'success': True,
            'data': {
                'predictions': results,
                'total': len(results)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    try:
        from utils.model_utils import get_model_instance
        
        model = get_model_instance()
        info = model.get_model_info()
        
        if 'error' in info:
            # Model not loaded, return basic info
            return jsonify({
                'success': False,
                'error': 'Model not loaded',
                'fallback_info': {
                    'model_type': 'Classification',
                    'algorithm': 'Rule-based (Fallback)',
                    'features': ['pH', 'Temperature', 'Turbidity', 'Dissolved Oxygen'],
                    'classes': ['Baik', 'Normal', 'Perlu Perhatian'],
                    'version': '1.0.0'
                }
            }), 503
        
        return jsonify({
            'success': True,
            'data': info
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# Error handlers
@api_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@api_bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

