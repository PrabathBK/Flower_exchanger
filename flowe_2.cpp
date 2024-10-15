
#include <iostream>
#include <vector>
#include <fstream>
#include <string>
#include <sstream>
#include <chrono>
#include <ctime>

using namespace std::chrono;
using namespace std;

ifstream ifile("test.csv");
ofstream ofile("Execution_Rep.csv");

// Order class
class Order
{
public:
    string orderID;
    string clientOrderID;
    string instrument;
    int side; // 1 = Buy, 2 = Sell
    string status;
    int quantity;
    double price;
    string error;

    Order(string orderID,
          string clientOrderID,
          string instrument,
          int side,
          int quantity,
          double price,
          string error)
        : orderID(orderID), clientOrderID(clientOrderID), instrument(instrument), side(side), quantity(quantity), price(price), error(error) {}
};

vector<Order> orders;

// Helper Function for find orders by ID
Order *findOrderByOrdID(string order_id)
{
    for (auto &o : orders)
    {
        if (o.orderID == order_id)
        {
            return &o;
        }
    }
    return nullptr;
}

// OrderBookEntry Class representing an order in the order book
class OrderBookEntry
{
public:
    string orderID;
    int quantity;
    double price;

    OrderBookEntry(string orderID, int quantity, double price) : orderID(orderID), quantity(quantity), price(price) {}
};

// OrderBook class manages the buy and sell orders for instruments
class OrderBook
{
public:
    string instrument;
    vector<OrderBookEntry> buy;
    vector<OrderBookEntry> sell;

    OrderBook(string instrument) : instrument(instrument) {}

    // addOrder function to add an order to the order book
    void addOrder(Order &order)
    {
        if (!order.error.empty())
        {
            order.status = "Rejected";
            writeLineOutputFile(order);
            return;
        }

        if (order.side == 1)
        {
            processOrder(order, sell, buy, false); // Process the entry as a buy order
        }
        else if (order.side == 2)
        {
            processOrder(order, buy, sell, true); // Process the entry as a sell order
        }

        // Print the current state of the order book after processing each order
        printOrderBook();
    }

    // Writes the execution details to the output file
    static void writeLineOutputFile(const Order &order)
    {
        ofile << order.orderID << "," << order.clientOrderID << "," << order.instrument << "," << order.side << "," << order.status << "," << order.quantity << "," << order.price << "," << order.error << endl;
    }
    static void writeLineOutputFile(const Order &order, int amount)
    {
        ofile << order.orderID << "," << order.clientOrderID << "," << order.instrument << "," << order.side << "," << order.status << "," << amount << "," << order.price << "," << order.error << endl;
    }
    static void writeLineOutputFile(const Order &order, int amount,double price)
    {
        ofile << order.orderID << "," << order.clientOrderID << "," << order.instrument << "," << order.side << "," << order.status << "," << amount << "," << price << "," << order.error << endl;
    }

    // Print the current state of the buy and sell order books
    void printOrderBook()
    {
        cout << "Order Book for instrument: " << instrument << endl;
        cout << "Buy Orders:" << endl;
        for (const auto &entry : buy)
        {
            cout << "OrderID: " << entry.orderID << ", Quantity: " << entry.quantity << ", Price: " << entry.price << endl;
        }
        cout << "Sell Orders:" << endl;
        for (const auto &entry : sell)
        {
            cout << "OrderID: " << entry.orderID << ", Quantity: " << entry.quantity << ", Price: " << entry.price << endl;
        }
        cout << "--------------------------------------" << endl;
    }

private:
    // Processes the order, trying to match it against the opposite side (buy or sell)
    void processOrder(Order &order, vector<OrderBookEntry> &oppositeBook, vector<OrderBookEntry> &sameBook, bool isSell)
    {
        string fillStatus[] = {"New", "Rejected", "Fill", "PFill"};

        // Check for matching orders in the opposite book (sell for buy, buy for sell)
        while (!oppositeBook.empty() && ((isSell && oppositeBook.front().price >= order.price) || (!isSell && oppositeBook.front().price <= order.price)) && order.quantity > 0)
        {

            int matchedQty = min(order.quantity, oppositeBook.front().quantity);

            string status = (order.quantity == oppositeBook.front().quantity) ? fillStatus[2] : fillStatus[3];
            order.status = status;


            oppositeBook.front().quantity -= matchedQty;
            writeLineOutputFile(order,matchedQty,(order.price!=oppositeBook.front().price)?oppositeBook.front().price:order.price);

            order.quantity -= matchedQty;

            if (oppositeBook.front().quantity == 0)
            {
                auto *matchedOrder = findOrderByOrdID(oppositeBook.front().orderID);
                if (matchedOrder)
                {
                    matchedOrder->status = fillStatus[2]; // Mark the opposite order as fully filled
                    writeLineOutputFile(*matchedOrder);
                }
                oppositeBook.erase(oppositeBook.begin()); // Remove fully matched orders
            }
        }

        // If the current order is not fully filled, insert the remaining unfilled quantity into the same side book
        if (order.quantity > 0)
        {
            insertOrder(sameBook, order, isSell);
        }
    }

    // Insert order into the buy/sell book, maintaining proper sorting
    void insertOrder(vector<OrderBookEntry> &book, Order &order, bool ascending)
    {
        auto item = OrderBookEntry(order.orderID, order.quantity, order.price);

        auto it = book.begin();
        while (it != book.end() && ((ascending && it->price < order.price) || (!ascending && it->price > order.price)))
        {
            ++it;
        }
        book.insert(it, item);

        order.status = "New";
        writeLineOutputFile(order);
    }
};

// Utility function to check the validity of orders
string checkValidityOfOrder(const vector<string> &v)
{
    if (v[0].empty())
        return "Invalid client order ID";
    if (v[1].empty())
        return "Invalid instrument";
    if (v[2].empty())
        return "Invalid side";
    if (v[3].empty())
        return "Invalid size";
    if (v[4].empty())
        return "Invalid price";

    string instrument = v[1];
    int side = stoi(v[2]);
    int quantity = stoi(v[3]);
    double price = stod(v[4]);

    if (instrument != "Rose" && instrument != "Lavender" && instrument != "Tulip" && instrument != "Orchid" && instrument != "Lotus")
    {
        return "Invalid instrument";
    }
    if (side != 1 && side != 2)
        return "Invalid side";
    if (price < 0)
        return "Invalid price";
    if (quantity % 10 != 0 || quantity < 10 || quantity > 1000)
        return "Invalid size";

    return "";
}

// Main function
int main()
{
    auto start = high_resolution_clock::now();

    if (!ifile.is_open())
    {
        cerr << "Error opening input file" << endl;
        return 1;
    }

    if (!ofile.is_open())
    {
        cerr << "Error opening output file" << endl;
        return 1;
    }

    // Write headers to output
    ofile << "Order ID, Client Order ID, Instrument, Side, Execution Status, Quantity, Price, error\n";

    int ordNumber = 1;
    string line;

    // Initialize the order books
    OrderBook rose("Rose");
    OrderBook lavender("Lavender");
    OrderBook tulip("Tulip");
    OrderBook orchid("Orchid");
    OrderBook lotus("Lotus");

    // Read and process the CSV file
    getline(ifile, line); // Skip headers

    while (getline(ifile, line))
    {
        stringstream ss(line);
        vector<string> v;
        string cell;

        while (getline(ss, cell, ','))
            v.push_back(cell);

        string validity = checkValidityOfOrder(v);
        Order order("ord" + to_string(ordNumber++), v[0], v[1], stoi(v[2]), stoi(v[3]), stod(v[4]), validity);
        orders.push_back(order);

        cout << "--------Before--------" << endl;

        // Print order details before processing
        cout << "Processing Order ID: " << order.orderID << ", Client Order ID: " << order.clientOrderID
             << ", Instrument: " << order.instrument << ", Side: " << order.side << ", Quantity: "
             << order.quantity << ", Price: " << order.price << ", Status: " << order.status << endl;

        // Select the corresponding order book
        if (v[1] == "Rose")
            rose.addOrder(order);
        else if (v[1] == "Lavender")
            lavender.addOrder(order);
        else if (v[1] == "Tulip")
            tulip.addOrder(order);
        else if (v[1] == "Orchid")
            orchid.addOrder(order);
        else if (v[1] == "Lotus")
            lotus.addOrder(order);
        else
        {
            order.status = "Rejected";
            OrderBook::writeLineOutputFile(order);
        }

        cout << "----------after----------" << endl;
        cout << "Processing Order ID: " << order.orderID << ", Client Order ID: " << order.clientOrderID
             << ", Instrument: " << order.instrument << ", Side: " << order.side << ", Quantity: "
             << order.quantity << ", Price: " << order.price << ", Status: " << order.status << endl;
    }

    ifile.close();
    ofile.close();

    auto stop = high_resolution_clock::now();
    auto duration = duration_cast<microseconds>(stop - start);
    cout << "Time taken: " << duration.count() << " microseconds" << endl;

    return 0;
}
