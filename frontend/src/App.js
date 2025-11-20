import React, { useState } from 'react';
import OrderForm from './components/OrderForm';
import ExecutionReport from './components/ExecutionReport';
import Header from './components/Header';
import './App.css';

function App() {
  const [executionReport, setExecutionReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('order');

  const handleOrdersSubmit = (report) => {
    setExecutionReport(report);
    setActiveTab('report');
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
            📝 Place Orders
          </button>
          <button 
            className={`tab ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            📊 Order Book
          </button>
        </div>

        <div className="content">
          {activeTab === 'order' && (
            <OrderForm 
              onSubmit={handleOrdersSubmit}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          
          {activeTab === 'report' && (
            <ExecutionReport 
              report={executionReport}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
