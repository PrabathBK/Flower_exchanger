const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const csvParser = require('csv-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Paths
const projectRoot = path.join(__dirname, '..');
const executablePath = path.join(projectRoot, 'flower_exchange');
const tempOrdersPath = path.join(projectRoot, 'temp_orders.csv');
const executionReportPath = path.join(projectRoot, 'Execution_Rep.csv');

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flower Exchange Backend is running' });
});

// Submit orders
app.post('/api/orders', async (req, res) => {
  try {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Invalid orders data' });
    }

    // Create CSV content
    const csvHeader = 'Client Order ID,Instrument,Side,Quantity,Price\n';
    const csvRows = orders.map(order => 
      `${order.clientOrderId},${order.instrument},${order.side},${order.quantity},${order.price}`
    ).join('\n');
    const csvContent = csvHeader + csvRows;

    // Write to temporary CSV file
    await fs.writeFile(tempOrdersPath, csvContent);

    // Execute the C++ program
    exec(`cd ${projectRoot} && ${executablePath}`, async (error, stdout, stderr) => {
      if (error) {
        console.error('Execution error:', error);
        return res.status(500).json({ error: 'Failed to execute trading engine', details: stderr });
      }

      // Read the execution report
      try {
        const executionReport = await readExecutionReport();
        
        // Clean up temp file
        await fs.remove(tempOrdersPath);

        res.json({
          success: true,
          message: 'Orders processed successfully',
          executionReport,
          consoleOutput: stdout
        });
      } catch (err) {
        console.error('Error reading execution report:', err);
        res.status(500).json({ error: 'Failed to read execution report' });
      }
    });

  } catch (err) {
    console.error('Error processing orders:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Upload CSV file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Move uploaded file to temp location
    await fs.move(req.file.path, tempOrdersPath, { overwrite: true });

    // Execute the C++ program
    exec(`cd ${projectRoot} && ${executablePath}`, async (error, stdout, stderr) => {
      if (error) {
        console.error('Execution error:', error);
        return res.status(500).json({ error: 'Failed to execute trading engine', details: stderr });
      }

      // Read the execution report
      try {
        const executionReport = await readExecutionReport();
        
        res.json({
          success: true,
          message: 'File processed successfully',
          executionReport,
          consoleOutput: stdout
        });
      } catch (err) {
        console.error('Error reading execution report:', err);
        res.status(500).json({ error: 'Failed to read execution report' });
      }
    });

  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Get execution report
app.get('/api/execution-report', async (req, res) => {
  try {
    const executionReport = await readExecutionReport();
    res.json({ success: true, executionReport });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read execution report', details: err.message });
  }
});

// Helper function to read execution report
function readExecutionReport() {
  return new Promise((resolve, reject) => {
    const results = [];
    
    if (!fs.existsSync(executionReportPath)) {
      return resolve([]);
    }

    fs.createReadStream(executionReportPath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flower Exchange Backend running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
