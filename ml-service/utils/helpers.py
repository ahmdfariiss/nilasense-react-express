"""
Helper Utilities
"""
import requests
import os
from datetime import datetime

def send_to_backend(endpoint, data):
    """
    Send data to backend API
    
    Args:
        endpoint: str - API endpoint (e.g., '/api/monitoring/update')
        data: dict - Data to send
        
    Returns:
        dict: Response from backend
    """
    try:
        backend_url = os.getenv('BACKEND_API_URL', 'http://localhost:3000')
        api_key = os.getenv('BACKEND_API_KEY', '')
        
        url = f"{backend_url}{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=10)
        return response.json()
        
    except Exception as e:
        return {'success': False, 'error': str(e)}


def format_timestamp(dt=None):
    """
    Format datetime to ISO string
    
    Args:
        dt: datetime object (default: now)
        
    Returns:
        str: ISO formatted timestamp
    """
    if dt is None:
        dt = datetime.utcnow()
    return dt.isoformat() + 'Z'


def calculate_water_quality_score(parameters):
    """
    Calculate overall water quality score (0-100)
    
    Args:
        parameters: dict with pH, temperature, turbidity, dissolved_oxygen
        
    Returns:
        int: Quality score (0-100)
    """
    score = 0
    
    # pH scoring (ideal: 6.5-8.5)
    ph = parameters['ph']
    if 6.5 <= ph <= 8.5:
        score += 25
    elif 6.0 <= ph < 6.5 or 8.5 < ph <= 9.0:
        score += 15
    else:
        score += 0
    
    # Temperature scoring (ideal: 25-30°C)
    temp = parameters['temperature']
    if 25 <= temp <= 30:
        score += 25
    elif 22 <= temp < 25 or 30 < temp <= 32:
        score += 15
    else:
        score += 0
    
    # Turbidity scoring (ideal: < 25 NTU)
    turbidity = parameters['turbidity']
    if turbidity < 25:
        score += 25
    elif 25 <= turbidity < 40:
        score += 15
    else:
        score += 0
    
    # Dissolved Oxygen scoring (ideal: > 5 mg/L)
    do = parameters['dissolved_oxygen']
    if do >= 5:
        score += 25
    elif 4 <= do < 5:
        score += 15
    else:
        score += 0
    
    return score

