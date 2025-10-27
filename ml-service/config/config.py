"""
Application Configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Flask
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Model paths
    MODEL_PATH = os.getenv('MODEL_PATH', 'models/trained/water_quality_model.pkl')
    SCALER_PATH = os.getenv('SCALER_PATH', 'models/trained/scaler.pkl')
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/app.log')
    
    # Backend integration
    BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:3000')
    BACKEND_API_KEY = os.getenv('BACKEND_API_KEY', '')
    
    # CORS
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
    
    # Model parameters
    CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', 0.7))
    MAX_BATCH_SIZE = int(os.getenv('MAX_BATCH_SIZE', 100))
    
    # Water quality thresholds
    PH_OPTIMAL_MIN = 6.5
    PH_OPTIMAL_MAX = 8.5
    TEMP_OPTIMAL_MIN = 25
    TEMP_OPTIMAL_MAX = 30
    TURBIDITY_OPTIMAL_MAX = 25
    DO_OPTIMAL_MIN = 5.0


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])

