@echo off
echo ================================
echo Anti-Drug Platform Setup
echo ================================
echo.

echo Step 1: Installing Frontend Dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo Step 2: Installing Backend Dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed successfully!
echo.

echo Step 3: Setting up environment files...
if not exist .env (
    copy .env.example .env
    echo Created .env file - Please edit with your settings
)

if not exist server\.env (
    copy server\.env.example server\.env
    echo Created server\.env file - Please edit with your settings
)
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo NEXT STEPS:
echo 1. Edit .env file with your API URL
echo 2. Edit server\.env file with:
echo    - MongoDB URI
echo    - JWT Secret
echo    - Gemini API Key
echo.
echo 3. Start MongoDB
echo 4. Run: npm run dev (frontend)
echo 5. Run: cd server; npm run dev (backend)
echo.
echo See SETUP_GUIDE.md for detailed instructions
echo.
pause
