# Flower Exchanger 🌸

A high-performance trading system simulator developed using C++ as the final project for the **High-Performance and Mission-Critical Software Development** workshop conducted by **London Stock Exchange Group (LSEG)**.

## Overview

This project simulates a complete order matching engine that processes buy and sell orders for flower instruments in real-time. The system implements price-time priority matching, comprehensive order validation, and generates detailed execution reports. Designed with a focus on performance, the engine processes orders in microseconds while maintaining clean, modular code architecture.

## Features

- **Multi-Instrument Support**: Handles five flower types (Rose, Lavender, Tulip, Orchid, Lotus)
- **Order Matching Engine**: Implements price-time priority algorithm
- **Order Validation**: Comprehensive checks for instrument, side, quantity, and price
- **Execution States**: Tracks New, Fill, Partial Fill (PFill), and Rejected orders
- **Performance Optimized**: Average execution time under 1 millisecond
- **CSV-Based I/O**: Easy-to-use CSV file interface for orders and execution reports

## Project Structure

```
Flower_exchanger/
├── flower_exchange.cpp      # Core matching engine implementation
├── flower_exchange          # Compiled executable (macOS/Linux)
├── flower_exchange.exe      # Compiled executable (Windows)
├── Execution_Rep.csv        # Output execution report
├── execution_rep.csv        # Legacy output file
├── README.md                # Project documentation
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
- C++ compiler with C++11 support (g++, clang, MSVC)
- Standard C++ library

### Compile

**macOS/Linux:**
```bash
g++ -std=c++11 -o flower_exchange flower_exchange.cpp
```

**Windows:**
```bash
g++ -std=c++11 -o flower_exchange.exe flower_exchange.cpp
```

### Run

**macOS/Linux:**
```bash
./flower_exchange
```

**Windows:**
```bash
flower_exchange.exe
```

### Change Input File

Edit line 11 in `flower_exchange.cpp`:
```cpp
ifstream ifile("testcases/Orders.csv");  // Change filename here
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

## Future Enhancements

- [ ] Add support for limit order types (FOK, IOC)
- [ ] Implement order cancellation/modification
- [ ] Add market order support
- [ ] Multi-threaded processing for higher throughput
- [ ] WebSocket interface for real-time order streaming
- [ ] Database persistence layer
- [ ] REST API for order submission

## Learning Outcomes

This project demonstrates:
- Order matching engine fundamentals
- C++ performance optimization techniques
- Financial market microstructure
- CSV data processing
- Object-oriented design patterns
- Algorithm complexity optimization

## Author

**Prabath Wijethilaka**  
Developed as part of LSEG High-Performance Software Development Workshop

## License

This project was created for educational purposes as part of the LSEG workshop.

---

**Note**: The input file path is currently hardcoded. To test different scenarios, modify line 11 in `flower_exchange.cpp` before compilation.
