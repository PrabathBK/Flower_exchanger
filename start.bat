@echo off
echo 🌸 Flower Exchange - Startup Script 🌸
echo ======================================
echo.

REM Check if C++ executable exists
if not exist "flower_exchange.exe" (
    echo ⚙️  Compiling C++ matching engine...
    g++ -std=c++11 -o flower_exchange.exe flower_exchange.cpp
    if %errorlevel% equ 0 (
        echo ✅ C++ engine compiled successfully!
    ) else (
        echo ❌ Failed to compile C++ engine
        exit /b 1
    )
) else (
    echo ✅ C++ engine already compiled
)

echo.
echo 📦 Installing dependencies...
echo.

REM Install backend dependencies
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed!
) else (
    echo ✅ Backend dependencies already installed
)

REM Install frontend dependencies
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo ✅ Frontend dependencies installed!
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo 🚀 Starting Flower Exchange...
echo.
echo 📊 Backend API: http://localhost:3001
echo 🌐 Frontend UI: http://localhost:3000
echo.
echo Press Ctrl+C to stop all servers
echo.

REM Start backend in new window
start "Flower Exchange Backend" cmd /c "cd backend && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window
start "Flower Exchange Frontend" cmd /c "cd frontend && npm start"

echo.
echo ✅ All servers started!
echo Close the terminal windows to stop the servers.
pause
