"""
Flask Application Factory for NilaSense ML Service
"""
from flask import Flask
from flask_cors import CORS
from config.config import Config


def create_app(config_class=Config):
    """
    Create and configure Flask application
    
    Args:
        config_class: Configuration class to use
        
    Returns:
        Flask app instance
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app)
    
    # Initialize ML model on startup
    with app.app_context():
        from utils.model_utils import get_model_instance
        try:
            model = get_model_instance()
            print("[OK] ML Model loaded successfully at startup!")
        except Exception as e:
            print(f"[WARNING] Could not load ML model: {e}")
            print("   The service will start but predictions may use fallback logic.")
    
    # Register blueprints
    from app.routes import api_bp
    app.register_blueprint(api_bp)
    
    # Root endpoint
    @app.route('/')
    def index():
        return {
            'service': 'NilaSense ML Service',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'health': '/api/health',
                'predict': '/api/predict',
                'batch_predict': '/api/predict/batch',
                'model_info': '/api/model/info'
            }
        }
    
    return app

