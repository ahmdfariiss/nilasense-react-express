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
    # Use port from environment or default to 5002
    port = int(os.getenv('PORT', os.getenv('FLASK_PORT', 5002)))
    debug = os.getenv('FLASK_ENV') == 'development'

    # Use 0.0.0.0 in production, localhost in development
    host = '0.0.0.0' if os.getenv('FLASK_ENV') == 'production' else '127.0.0.1'

    print(f"\n{'='*50}")
    print(f"NilaSense ML Service Starting...")
    print(f"{'='*50}")
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"Debug Mode: {debug}")
    print(f"{'='*50}\n")

    try:
        app.run(
            host=host,
            port=port,
            debug=debug
        )
    except OSError as e:
        if "forbidden" in str(e).lower() or "permission" in str(e).lower():
            print(f"\n[ERROR] Cannot bind to port {port}")
            print(f"   Port {port} mungkin sudah digunakan atau terbatas.")
            print(f"\n[INFO] Solusi:")
            print(f"   1. Gunakan port lain dengan set FLASK_PORT:")
            print(f"      FLASK_PORT=5002 python run.py")
            print(f"   2. Atau buat file .env dengan:")
            print(f"      FLASK_PORT=5002")
            print(f"\n   Mencoba port alternatif...\n")
            # Try alternative ports
            for alt_port in [5002, 5003, 5004, 8000, 8080]:
                try:
                    print(f"   Mencoba port {alt_port}...")
                    app.run(host=host, port=alt_port, debug=debug)
                    break
                except OSError:
                    continue
            else:
                print("\n[ERROR] Semua port alternatif gagal. Silakan hentikan proses yang menggunakan port tersebut.")
        else:
            raise

