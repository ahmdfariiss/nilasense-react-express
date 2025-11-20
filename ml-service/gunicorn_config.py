import os

# Bind to 0.0.0.0 with PORT from environment
bind = f"0.0.0.0:{os.environ.get('PORT', '5002')}"

# Worker processes
workers = 2
threads = 2

# Timeout
timeout = 120

# Worker class
worker_class = 'sync'

# Logging
loglevel = 'info'
accesslog = '-'
errorlog = '-'
