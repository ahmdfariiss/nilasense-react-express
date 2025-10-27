"""
NilaSense ML Service - Entry Point
"""
import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables
load_dotenv()

# Create Flask app
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"\n{'='*50}")
    print(f"🐟 NilaSense ML Service Starting...")
    print(f"{'='*50}")
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"Port: {port}")
    print(f"Debug Mode: {debug}")
    print(f"{'='*50}\n")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

