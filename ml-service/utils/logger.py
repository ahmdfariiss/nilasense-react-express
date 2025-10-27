"""
Logging Configuration
"""
import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime

def setup_logger(app):
    """
    Setup application logger
    
    Args:
        app: Flask application instance
    """
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
    
    # Get log level from environment
    log_level = os.getenv('LOG_LEVEL', 'INFO')
    
    # Configure logging format
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )
    
    # File handler
    file_handler = RotatingFileHandler(
        'logs/app.log',
        maxBytes=10240000,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(getattr(logging, log_level))
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(getattr(logging, log_level))
    
    # Add handlers to app logger
    app.logger.addHandler(file_handler)
    app.logger.addHandler(console_handler)
    app.logger.setLevel(getattr(logging, log_level))
    
    app.logger.info('Logger initialized successfully')

