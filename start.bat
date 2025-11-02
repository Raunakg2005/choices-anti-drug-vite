@echo off
echo ================================
echo Starting Anti-Drug Platform
echo ================================
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Frontend Development Server...
start cmd /k "npm run dev"

echo.
echo ================================
echo Servers Started!
echo ================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq *npm run dev*" /F
echo.
echo Servers stopped.
pause
