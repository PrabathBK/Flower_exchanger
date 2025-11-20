#!/bin/bash

echo "🌸 Flower Exchange - Startup Script 🌸"
echo "======================================"
echo ""

# Check if C++ executable exists
if [ ! -f "./flower_exchange" ]; then
    echo "⚙️  Compiling C++ matching engine..."
    g++ -std=c++11 -o flower_exchange flower_exchange.cpp
    if [ $? -eq 0 ]; then
        echo "✅ C++ engine compiled successfully!"
    else
        echo "❌ Failed to compile C++ engine"
        exit 1
    fi
else
    echo "✅ C++ engine already compiled"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
if [ ! -d "./backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    echo "✅ Backend dependencies installed!"
else
    echo "✅ Backend dependencies already installed"
fi

# Install frontend dependencies
if [ ! -d "./frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    echo "✅ Frontend dependencies installed!"
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "🚀 Starting Flower Exchange..."
echo ""
echo "📊 Backend API: http://localhost:3001"
echo "🌐 Frontend UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to kill all background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start backend
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait
