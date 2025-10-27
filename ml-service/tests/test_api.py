"""
API Tests
"""
import pytest
import json
from app import create_app

@pytest.fixture
def client():
    """Create test client"""
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'version' in data


def test_predict_valid_data(client):
    """Test prediction with valid data"""
    payload = {
        'ph': 7.2,
        'temperature': 28.5,
        'turbidity': 15.3,
        'dissolved_oxygen': 6.8
    }
    
    response = client.post(
        '/api/predict',
        data=json.dumps(payload),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert 'quality' in data['data']
    assert 'description' in data['data']
    assert data['data']['quality'] in ['Baik', 'Normal', 'Buruk']


def test_predict_missing_data(client):
    """Test prediction with missing data"""
    payload = {
        'ph': 7.2,
        'temperature': 28.5
        # missing turbidity and dissolved_oxygen
    }
    
    response = client.post(
        '/api/predict',
        data=json.dumps(payload),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] == False


def test_predict_invalid_range(client):
    """Test prediction with invalid value range"""
    payload = {
        'ph': 15.0,  # Invalid pH
        'temperature': 28.5,
        'turbidity': 15.3,
        'dissolved_oxygen': 6.8
    }
    
    response = client.post(
        '/api/predict',
        data=json.dumps(payload),
        content_type='application/json'
    )
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] == False


def test_batch_prediction(client):
    """Test batch prediction"""
    payload = {
        'readings': [
            {
                'ph': 7.2,
                'temperature': 28.5,
                'turbidity': 15.3,
                'dissolved_oxygen': 6.8
            },
            {
                'ph': 6.8,
                'temperature': 27.0,
                'turbidity': 22.0,
                'dissolved_oxygen': 5.5
            }
        ]
    }
    
    response = client.post(
        '/api/predict/batch',
        data=json.dumps(payload),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert len(data['data']['predictions']) == 2

