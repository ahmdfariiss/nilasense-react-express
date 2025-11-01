@echo off
echo ========================================
echo   NilaSense - Start All Services
echo ========================================
echo.

echo [1/3] Starting ML Service...
start "ML Service" cmd /k "cd ml-service && venv\Scripts\activate && python run.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   All services are starting...
echo ========================================
echo.
echo ML Service: http://localhost:5002
echo Backend:    http://localhost:5001
echo Frontend:   http://localhost:5173
echo.
echo Press any key to exit...
pause >nul


