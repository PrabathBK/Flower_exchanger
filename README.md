# Flower Exchange Trading System

> A high-performance trading system simulator with modern web interface, developed as the final project for the **High-Performance and Mission-Critical Software Development** workshop by **London Stock Exchange Group (LSEG)**.

[![C++](https://img.shields.io/badge/C++-11-blue.svg)](https://isocpp.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Educational-orange.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
  - [Web Interface](#web-interface)
  - [Command Line](#command-line)
  - [API Integration](#api-integration)
- [How It Works](#how-it-works)
- [Performance](#performance)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Flower Exchange is a complete order matching engine that processes buy and sell orders for flower instruments in real-time. The system implements a **price-time priority algorithm**, comprehensive order validation, and generates detailed execution reports - all in **sub-millisecond** execution time.

### What Makes It Special?

- **Lightning Fast**: Average execution time of 492 microseconds
- **Modern UI**: Beautiful gradient-based React interface
- **Full-Stack**: C++ engine + Node.js API + React frontend
- **Real-time**: Live order book visualization
- **Production-Ready**: Complete with tests, docs, and automation

---

## ✨ Features

### Core Trading Engine
- Sub-millisecond order matching (C++)
- Price-time priority algorithm
- Comprehensive order validation
- 5 flower instruments (Rose, Lavender, Tulip, Orchid, Lotus)
- Multiple execution states (New, Fill, PFill, Rejected)
- CSV input/output support

### Web Application
- Modern gradient UI design
- Dynamic order placement form
- CSV file upload
- Live order book display
- Real-time statistics dashboard
- Fully responsive (mobile-friendly)
- Smooth animations

### Backend API
- RESTful architecture
- File upload handling
- C++ engine integration
- CSV parsing
- CORS enabled
- Error handling

---

## 🚀 Quick Start

### One-Command Startup

**macOS/Linux:**
```bash
chmod +x start.sh && ./start.sh
```

**Windows:**
```cmd
start.bat
```

That's it! The script will:
- ✅ Compile the C++ engine
- ✅ Install all dependencies
- ✅ Start backend (port 3001)
- ✅ Start frontend (port 3000)
- ✅ Open your browser

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

---

## 📁 Project Structure

```
Flower_exchanger/
├── 🔧 Core Engine
│   ├── flower_exchange.cpp          # C++ matching engine
│   └── flower_exchange              # Compiled executable
│
├── 🖥️ Backend (Node.js + Express)
│   ├── server.js                    # REST API
│   ├── package.json                 # Dependencies
│   └── uploads/                     # File uploads
│
├── 🎨 Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js           # App header
│   │   │   ├── OrderForm.js        # Order input
│   │   │   └── ExecutionReport.js  # Order book view
│   │   ├── App.js                  # Main app
│   │   └── index.js                # Entry point
│   └── package.json
│
├── 📁 Test Cases
│   └── testcases/                   # 8 test scenarios
│
├── 🚀 Automation
│   ├── start.sh                     # macOS/Linux startup
│   └── start.bat                    # Windows startup
│
└── 📚 Documentation
    ├── README.md                    # This file
    └── docs/                        # Additional docs
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18.2 | UI Components |
| | Axios | HTTP Client |
| | React Icons | Icons |
| | CSS3 | Styling & Animations |
| **Backend** | Node.js + Express | REST API |
| | Multer | File Uploads |
| | csv-parser | CSV Processing |
| | CORS | Cross-Origin |
| **Engine** | C++11 | Order Matching |
| | STL | Data Structures |
| | Streams | File I/O |

---

## 💻 Installation

### Prerequisites

- **C++ Compiler**: g++ with C++11 support
- **Node.js**: v14 or higher
- **npm**: v6 or higher

**Check versions:**
```bash
g++ --version
node --version
npm --version
```

**Install on macOS:**
```bash
brew install gcc node
```

**Install on Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install g++ nodejs npm
```

### Manual Setup

#### 1. Compile C++ Engine
```bash
g++ -std=c++11 -o flower_exchange flower_exchange.cpp
```

#### 2. Setup Backend
```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3001`

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

Frontend opens at `http://localhost:3000`

---

## 📖 Usage

### Web Interface

1. **Navigate to** `http://localhost:3000`
2. **Place Orders Tab:**
   - Fill order details (Client ID, Instrument, Side, Quantity, Price)
   - Click "Add Another Order" for multiple orders
   - Or upload a CSV file
   - Click "Execute Orders"
3. **Order Book Tab:**
   - View buy orders (left side)
   - View sell orders (right side)
   - See execution statistics

### Command Line

1. **Create input file** `temp_orders.csv`:
```csv
Client Order ID,Instrument,Side,Quantity,Price
aa13,Rose,1,100,55
aa14,Rose,2,50,54
```

2. **Run engine:**
```bash
./flower_exchange
```

3. **Check output** `Execution_Rep.csv`

### API Integration

**Submit orders via API:**
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orders": [{
      "clientOrderId": "aa1",
      "instrument": "Rose",
      "side": "1",
      "quantity": "100",
      "price": "50"
    }]
  }'
```

**Upload CSV file:**
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@orders.csv"
```

---

## 🔍 How It Works

### Order Matching Algorithm

The system uses **price-time priority** matching:

1. **Buy Orders**: Sorted by price (highest first), then time
2. **Sell Orders**: Sorted by price (lowest first), then time
3. **Matching**: Orders matched when price conditions met
4. **Execution**: Filled at resting order price

### Order Book Structure

Each instrument maintains separate order books:
- **Buy orders** with price ≥ best sell → matched immediately
- **Sell orders** with price ≤ best buy → matched immediately
- **Unmatched portions** → remain as "New" orders

### Validation Rules

| Field | Rule |
|-------|------|
| Client Order ID | Not empty |
| Instrument | Rose, Lavender, Tulip, Orchid, or Lotus |
| Side | 1 (Buy) or 2 (Sell) |
| Quantity | Multiple of 10, between 10-999 |
| Price | ≥ 0 |

### Execution States

- **New**: Order in book, awaiting match
- **Fill**: Fully executed
- **PFill**: Partially filled
- **Rejected**: Validation failed

---

## ⚡ Performance

### Benchmark Results

| Metric | Value |
|--------|-------|
| Average Execution | 492 μs |
| Fastest | 286 μs |
| Slowest | 703 μs |
| Throughput | 2,000+ orders/sec |

### Test Cases (All Passing ✅)

| Test | Description | Time | Status |
|------|-------------|------|--------|
| Orders.csv | Single sell order | 410 μs | ✅ |
| Orders2.csv | No matching | 318 μs | ✅ |
| Orders3.csv | Exact match | 578 μs | ✅ |
| Orders4.csv | Partial fill | 703 μs | ✅ |
| Orders5.csv | Multiple buys vs sell | 286 μs | ✅ |
| Orders6.csv | Complete matching | 680 μs | ✅ |
| Orders7.csv | Validation tests | 445 μs | ✅ |
| test.csv | Multiple partials | 520 μs | ✅ |

---

## 📡 API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Flower Exchange Backend is running"
}
```

#### 2. Submit Orders
```http
POST /orders
Content-Type: application/json
```

**Request:**
```json
{
  "orders": [
    {
      "clientOrderId": "aa13",
      "instrument": "Rose",
      "side": "1",
      "quantity": "100",
      "price": "55"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Orders processed successfully",
  "executionReport": [...]
}
```

#### 3. Upload CSV
```http
POST /upload
Content-Type: multipart/form-data
```

**Form Data:**
- Field: `file`
- Type: CSV file

#### 4. Get Execution Report
```http
GET /execution-report
```

---

## ⚙️ Configuration

### Change Input File (CLI Mode)

Edit `flower_exchange.cpp` line 11:
```cpp
ifstream ifile("your_file.csv");
```

### Change Ports

**Backend** - Create `backend/.env`:
```env
PORT=3001
```

**Frontend** - Create `frontend/.env`:
```env
PORT=3000
```

### Enable Debugging

**C++**: Uncomment debug prints in `flower_exchange.cpp`
```cpp
// Lines 188-191, 199-202
cout << "Processing Order..." << endl;
```

---

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# macOS/Linux
kill -9 $(lsof -ti:3001)  # Backend
kill -9 $(lsof -ti:3000)  # Frontend

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Module Not Found**
```bash
cd backend && npm install
cd frontend && npm install
```

**C++ Compilation Error**
```bash
# Ensure g++ is installed
g++ --version

# Recompile
g++ -std=c++11 -o flower_exchange flower_exchange.cpp
```

**CORS Error**
- Verify backend is running on port 3001
- Check browser console for details

**Orders Not Executing**
- Ensure `flower_exchange` executable exists
- Check `temp_orders.csv` can be created
- Verify backend logs for errors

### Getting Help

1. Check error messages in console
2. Review backend terminal output
3. Verify all dependencies installed
4. Ensure correct Node.js/npm versions
5. Check file permissions (Unix/Linux)

---

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` (Purple)
- **Secondary**: `#764ba2` (Deep Purple)
- **Success**: `#38ef7d` (Green)
- **Warning**: `#f5576c` (Pink)
- **Info**: `#00f2fe` (Cyan)

### Gradients
- **Header**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Buy Header**: `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)`
- **Sell Header**: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

---

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

Output in `frontend/build/`

**Backend with PM2:**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name flower-exchange
pm2 save
pm2 startup
```

### Docker (Optional)

```dockerfile
FROM node:14
WORKDIR /app

# Install g++
RUN apt-get update && apt-get install -y g++

# Copy and compile C++
COPY flower_exchange.cpp ./
RUN g++ -std=c++11 -o flower_exchange flower_exchange.cpp

# Install backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend build
COPY frontend/build ./frontend/build

EXPOSE 3001
CMD ["node", "backend/server.js"]
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Order matching engine fundamentals
- ✅ C++ performance optimization
- ✅ Financial market microstructure
- ✅ Full-stack web development
- ✅ RESTful API design
- ✅ React component architecture
- ✅ File upload/processing
- ✅ Real-time data visualization
- ✅ Algorithm complexity optimization

---

## 🔮 Future Enhancements

- [ ] WebSocket real-time updates
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Order cancellation/modification
- [ ] Advanced order types (FOK, IOC)
- [ ] Market orders
- [ ] Price charts
- [ ] Dark mode
- [ ] Mobile app
- [ ] Export to PDF/Excel
- [ ] Analytics dashboard

---

## Changelog

### Version 2.0.0 (Current)
- Full-stack web application
- Modern React frontend
- Node.js REST API
- Order book visualization
- Automated setup scripts
- Comprehensive documentation

### Version 1.0.0
- C++ matching engine
- CLI interface
- 8 test cases
- Basic documentation

---

## 👨‍💻 Author

**Prabath Wijethilaka**  
Developed as part of LSEG High-Performance Software Development Workshop

- GitHub: [@PrabathBK](https://github.com/PrabathBK)
- Project: Flower Exchange Trading System
- Date: November 2025

---

## 🙏 Acknowledgments

- **London Stock Exchange Group (LSEG)** for the workshop
- **High-Performance Software Development** course instructors
- Open-source community for amazing tools

---

## 📄 License

This project was created for **educational purposes** as part of the LSEG workshop.

---

## Support

If you found this project helpful, please consider:
- Starring the repository
- Forking for your own experiments
- Sharing with others
- Reporting issues
- Suggesting improvements

---

<div align="center">

**Built with quality and performance in mind**

Flower Exchange Trading System

</div>

## Overview

This project simulates a complete order matching engine that processes buy and sell orders for flower instruments in real-time. The system implements price-time priority matching, comprehensive order validation, and generates detailed execution reports. Designed with a focus on performance, the engine processes orders in microseconds while maintaining clean, modular code architecture.

## Features

- **Multi-Instrument Support**: Handles five flower types (Rose, Lavender, Tulip, Orchid, Lotus)
- **Order Matching Engine**: Implements price-time priority algorithm
- **Order Validation**: Comprehensive checks for instrument, side, quantity, and price
- **Execution States**: Tracks New, Fill, Partial Fill (PFill), and Rejected orders
- **Performance Optimized**: Average execution time under 1 millisecond
- **CSV-Based I/O**: Easy-to-use CSV file interface for orders and execution reports
- **Modern Web Interface**: Full-stack web application with React frontend and Node.js backend
- **Real-time Execution Reports**: Interactive dashboard displaying order executions
- **RESTful API**: Backend API for programmatic order submission
- **File Upload Support**: CSV file upload functionality for batch order processing

## Project Structure

```
Flower_exchanger/
├── flower_exchange.cpp      # Core matching engine implementation
├── flower_exchange          # Compiled executable (macOS/Linux)
├── flower_exchange.exe      # Compiled executable (Windows)
├── temp_orders.csv          # Temporary orders file for web interface
├── Execution_Rep.csv        # Output execution report
├── README.md                # Project documentation
├── FRONTEND_SETUP.md        # Frontend setup guide
├── backend/                 # Node.js/Express backend
│   ├── server.js            # REST API server
│   ├── package.json         # Backend dependencies
│   └── uploads/             # Temporary file uploads
├── frontend/                # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.js    # Application header
│   │   │   ├── OrderForm.js # Order placement form
│   │   │   └── ExecutionReport.js # Execution report display
│   │   ├── App.js           # Main application component
│   │   └── index.js         # React entry point
│   └── package.json         # Frontend dependencies
└── testcases/               # Test case directory
    ├── Orders.csv           # Single sell order test
    ├── Orders2.csv          # No matching scenario
    ├── Orders3.csv          # Exact match test
    ├── Orders4.csv          # Partial fill test
    ├── Orders5.csv          # Multiple buys vs sell
    ├── Orders6.csv          # Complete matching scenario
    ├── Orders7.csv          # Validation tests
    └── test.csv             # Multiple partial fills
```

## How It Works

### Order Matching Algorithm

The system uses a **price-time priority** matching algorithm:

1. **Buy Orders**: Sorted by price (highest first), then by time
2. **Sell Orders**: Sorted by price (lowest first), then by time
3. **Matching**: When a new order arrives, it's matched against opposite side orders if price conditions are met
4. **Execution**: Orders are filled at the price of the resting order in the book

### Order Book Structure

Each instrument maintains separate buy and sell order books:
- Buy orders with prices ≥ best sell price are matched immediately
- Sell orders with prices ≤ best buy price are matched immediately
- Unmatched portions remain in the order book as "New" orders

### Validation Rules

Orders are validated against the following criteria:

| Field | Validation Rule |
|-------|----------------|
| Client Order ID | Must not be empty |
| Instrument | Must be one of: Rose, Lavender, Tulip, Orchid, Lotus |
| Side | Must be 1 (Buy) or 2 (Sell) |
| Quantity | Must be multiple of 10, between 10-999 |
| Price | Must be ≥ 0 |

## Compilation & Execution

### Prerequisites
- **C++ Engine**: C++ compiler with C++11 support (g++, clang, MSVC)
- **Backend**: Node.js v14+ and npm
- **Frontend**: Node.js v14+ and npm (or yarn)

### Method 1: Using the Web Interface (Recommended)

**Step 1: Compile the C++ Engine**

```bash
g++ -std=c++11 -o flower_exchange flower_exchange.cpp
```

**Step 2: Start the Backend Server**

```bash
cd backend
npm install          # First time only
npm start
```

Backend runs on `http://localhost:3001`

**Step 3: Start the Frontend Application**

```bash
cd frontend
npm install          # First time only
npm start
```

Frontend opens automatically at `http://localhost:3000`

**Step 4: Use the Web Interface**

1. Navigate to `http://localhost:3000`
2. Click "📝 Place Orders" tab
3. Fill in order details or upload a CSV file
4. Click "Execute Orders"
5. View results in "📊 Execution Report" tab

### Method 2: Command Line (Traditional)

**Compile:**

**macOS/Linux:**
```bash
g++ -std=c++11 -o flower_exchange flower_exchange.cpp
```

**Windows:**
```bash
g++ -std=c++11 -o flower_exchange.exe flower_exchange.cpp
```

**Run:**

1. Create a `temp_orders.csv` file with your orders
2. Execute the program:

**macOS/Linux:**
```bash
./flower_exchange
```

**Windows:**
```bash
flower_exchange.exe
```

3. Check `Execution_Rep.csv` for results

### Change Input File (CLI Mode)

Edit line 11 in `flower_exchange.cpp`:
```cpp
ifstream ifile("temp_orders.csv");  // Change filename here
```

## Input Format

CSV file with the following structure:

```csv
Client Order ID,Instrument,Side,Quantity,Price
aa13,Rose,1,100,55
aa14,Rose,2,50,54
```

- **Client Order ID**: Unique identifier for the order
- **Instrument**: Rose, Lavender, Tulip, Orchid, or Lotus
- **Side**: 1 = Buy, 2 = Sell
- **Quantity**: Order size (must be multiple of 10)
- **Price**: Order price (decimal allowed)

## Output Format

The execution report (`Execution_Rep.csv`) contains:

```csv
Order ID, Client Order ID, Instrument, Side, Execution Status, Quantity, Price, error
ord1,aa13,Rose,1,New,100,55,
ord2,aa14,Rose,2,Fill,50,55,
ord1,aa13,Rose,1,Fill,50,55,
```

### Execution Status Types

- **New**: Order placed in the order book (not yet matched)
- **Fill**: Order fully executed
- **PFill**: Order partially filled
- **Rejected**: Order rejected due to validation error

## Test Cases

### Orders.csv - Single Sell Order
**Input**: 1 sell order  
**Expected**: Order placed in sell book  
**Result**: ✅ Executed in 410 μs

### Orders2.csv - No Matching
**Input**: 2 sell orders, 1 buy order (price too low)  
**Expected**: No matches, all orders remain in book  
**Result**: ✅ Executed in 318 μs

### Orders3.csv - Exact Match
**Input**: 2 sell orders, 1 buy order matching second sell  
**Expected**: Buy matches with lower-priced sell order  
**Result**: ✅ Executed in 578 μs

### Orders4.csv - Partial Fill
**Input**: 2 sells (100 each), 1 buy (200)  
**Expected**: Buy partially filled against first sell  
**Result**: ✅ Executed in 703 μs

### Orders5.csv - Multiple Buys vs Sell
**Input**: 2 buy orders, 1 large sell order  
**Expected**: Sell matches both buys sequentially  
**Result**: ✅ Executed in 286 μs

### Orders6.csv - Complete Matching
**Input**: 2 buys, 1 sell (300), 1 buy  
**Expected**: Complex matching with multiple fills  
**Result**: ✅ Executed in 680 μs

### Orders7.csv - Validation Tests
**Input**: Various invalid orders (empty instrument, invalid side, bad quantity, negative price)  
**Expected**: All orders rejected with appropriate error messages  
**Result**: ✅ Executed in 445 μs

### test.csv - Multiple Partial Fills
**Input**: 2 sells (different quantities), 2 buys  
**Expected**: Sequential partial fills  
**Result**: ✅ Executed in 520 μs

## Performance Metrics

- **Average Execution Time**: 492 microseconds (0.492 ms)
- **Range**: 286 μs - 703 μs
- **Orders Processed**: 1-5 orders per test case
- **Throughput**: ~2,000+ orders/second potential

## Code Architecture

### Classes

1. **Order**: Represents a single order with validation status
2. **OrderBookEntry**: Lightweight entry in the order book
3. **OrderBook**: Manages buy/sell books for each instrument

### Key Functions

- `checkValidityOfOrder()`: Validates order parameters
- `processOrder()`: Matches orders against opposite side
- `insertOrder()`: Inserts orders into sorted book
- `writeLineOutputFile()`: Writes execution records

## Technical Highlights

- **Price-Time Priority**: Industry-standard matching algorithm
- **In-Memory Order Books**: Separate books per instrument for O(1) instrument lookup
- **Sorted Order Insertion**: Maintains price priority automatically
- **Zero-Copy Matching**: Efficient order processing
- **Comprehensive Logging**: Every order state change recorded
- **RESTful Architecture**: Clean separation between frontend, backend, and core engine
- **Modern UI/UX**: Gradient backgrounds, smooth animations, and responsive design
- **Real-time Updates**: Instant execution report display
- **Type-Safe Components**: React functional components with proper prop handling
- **API-First Design**: Backend can be integrated with any frontend or consumed programmatically

## Web Application Architecture

### Technology Stack

**Frontend:**
- React 18.2
- Axios for HTTP requests
- React Icons for UI elements
- CSS3 with gradients and animations

**Backend:**
- Node.js with Express
- Multer for file uploads
- CSV Parser for report processing
- CORS enabled for cross-origin requests

**Core Engine:**
- C++ with STL containers
- CSV file I/O
- High-performance matching algorithm

### API Endpoints

**Base URL:** `http://localhost:3001/api`

1. **POST /orders**
   - Submit orders via JSON
   - Body: `{ orders: [...] }`
   - Returns: Execution report

2. **POST /upload**
   - Upload CSV file with orders
   - Form-data with 'file' field
   - Returns: Execution report

3. **GET /execution-report**
   - Retrieve latest execution report
   - Returns: Array of execution records

4. **GET /health**
   - Health check endpoint
   - Returns: `{ status: 'ok' }`

### Component Structure

```
App (Main Container)
├── Header (Branding & Navigation)
├── Tabs (Order Form / Execution Report)
│   ├── OrderForm
│   │   ├── Order Input Fields
│   │   ├── Add/Remove Order Buttons
│   │   └── CSV Upload Section
│   └── ExecutionReport
│       ├── Statistics Cards
│       └── Execution Table
```

## Future Enhancements

- [ ] Add support for limit order types (FOK, IOC)
- [ ] Implement order cancellation/modification via UI
- [ ] Add market order support
- [ ] Multi-threaded processing for higher throughput
- [ ] WebSocket interface for real-time order streaming
- [ ] Database persistence layer (MongoDB/PostgreSQL)
- [ ] User authentication and authorization
- [ ] Order history and analytics dashboard
- [ ] Export execution reports to PDF/Excel
- [ ] Mobile-responsive design improvements
- [ ] Dark mode toggle
- [ ] Advanced charting and visualization
- [ ] Order book depth visualization
- [ ] Real-time price charts

## Learning Outcomes

This project demonstrates:
- Order matching engine fundamentals
- C++ performance optimization techniques
- Financial market microstructure
- CSV data processing
- Object-oriented design patterns
- Algorithm complexity optimization
- Full-stack web development (React + Node.js + C++)
- RESTful API design and implementation
- Frontend-backend integration
- Modern UI/UX design principles
- File upload and processing
- Real-time data visualization
- Component-based architecture

## 📚 Documentation

### Main Documentation
- **README.md** (this file) - Complete project documentation
- **QUICK_REFERENCE.md** - Developer quick reference card
- **COMPLETION_REPORT.md** - Detailed project completion summary
- **CHANGELOG.md** - Version history and updates

### Technical Documentation
- **docs/API_DOCUMENTATION.md** - REST API reference with examples
- **docs/INSTALLATION_GUIDE.md** - Comprehensive setup and deployment guide
- **docs/FRONTEND_FEATURES.md** - UI/UX design documentation
- **FRONTEND_SETUP.md** - Frontend installation instructions

## Author

**Prabath Wijethilaka**  
Developed as part of LSEG High-Performance Software Development Workshop

## License

This project was created for educational purposes as part of the LSEG workshop.

---

## Quick Start Guide

### Option 1: Using Startup Script (Easiest)

**macOS/Linux:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

The script will:
- ✅ Compile the C++ engine
- ✅ Install all dependencies
- ✅ Start the backend server
- ✅ Start the frontend application
- ✅ Open your browser automatically

### Option 2: Manual Setup

1. **Clone and Navigate:**
   ```bash
   cd Flower_exchanger
   ```

2. **Compile C++ Engine:**
   ```bash
   g++ -std=c++11 -o flower_exchange flower_exchange.cpp
   ```

3. **Start Backend:**
   ```bash
   cd backend
   npm install && npm start
   ```

4. **Start Frontend (new terminal):**
   ```bash
   cd frontend
   npm install && npm start
   ```

5. **Open Browser:**
   Navigate to `http://localhost:3000` and start trading! 🌸

## Troubleshooting

**Backend not starting?**
- Ensure Node.js is installed: `node --version`
- Check if port 3001 is available
- Run `npm install` in the backend folder

**Frontend not loading?**
- Ensure port 3000 is available
- Clear browser cache
- Check console for errors

**Orders not executing?**
- Verify backend is running
- Check that `flower_exchange` executable exists
- Ensure temp_orders.csv can be created in project root

**Note**: The C++ engine reads from `temp_orders.csv` when using the web interface. For CLI testing, you can modify the input file path in `flower_exchange.cpp` (line 11).
