"""
Input Validation for Sensor Data
"""

def validate_sensor_data(data):
    """
    Validate sensor input data
    
    Args:
        data: dict with sensor readings
        
    Returns:
        dict: {'valid': bool, 'errors': list}
    """
    errors = []
    
    # Required fields
    required_fields = ['ph', 'temperature', 'turbidity', 'dissolved_oxygen']
    
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")
    
    # If missing fields, return early
    if errors:
        return {'valid': False, 'errors': errors}
    
    # Validate ranges
    try:
        # pH validation (0-14)
        ph = float(data['ph'])
        if not 0 <= ph <= 14:
            errors.append("pH must be between 0 and 14")
        
        # Temperature validation (-10 to 50°C for safety)
        temperature = float(data['temperature'])
        if not -10 <= temperature <= 50:
            errors.append("Temperature must be between -10 and 50°C")
        
        # Turbidity validation (0-1000 NTU)
        turbidity = float(data['turbidity'])
        if not 0 <= turbidity <= 1000:
            errors.append("Turbidity must be between 0 and 1000 NTU")
        
        # Dissolved Oxygen validation (0-20 mg/L)
        dissolved_oxygen = float(data['dissolved_oxygen'])
        if not 0 <= dissolved_oxygen <= 20:
            errors.append("Dissolved oxygen must be between 0 and 20 mg/L")
            
    except ValueError as e:
        errors.append(f"Invalid numeric value: {str(e)}")
    except Exception as e:
        errors.append(f"Validation error: {str(e)}")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }


def validate_batch_data(readings):
    """
    Validate batch of sensor readings
    
    Args:
        readings: list of sensor data dicts
        
    Returns:
        dict: {'valid': bool, 'errors': list}
    """
    if not isinstance(readings, list):
        return {'valid': False, 'errors': ['Readings must be an array']}
    
    if len(readings) == 0:
        return {'valid': False, 'errors': ['Readings array cannot be empty']}
    
    # Validate each reading
    all_errors = []
    for i, reading in enumerate(readings):
        validation = validate_sensor_data(reading)
        if not validation['valid']:
            all_errors.append({
                'index': i,
                'errors': validation['errors']
            })
    
    return {
        'valid': len(all_errors) == 0,
        'errors': all_errors
    }

