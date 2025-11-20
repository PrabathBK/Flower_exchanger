import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCircle } from 'react-icons/fa';
import './ExecutionReport.css';

function ExecutionReport({ report, loading }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Fill':
        return <FaCheckCircle className="status-icon fill" />;
      case 'PFill':
        return <FaClock className="status-icon pfill" />;
      case 'New':
        return <FaCircle className="status-icon new" />;
      case 'Rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const badgeClass = `status-badge ${status.toLowerCase()}`;
    return <span className={badgeClass}>{status}</span>;
  };

  const getSideLabel = (side) => {
    return side === '1' || side === 1 ? '📈 Buy' : '📉 Sell';
  };

  if (loading) {
    return (
      <div className="execution-report">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Processing orders...</p>
        </div>
      </div>
    );
  }

  if (!report || report.length === 0) {
    return (
      <div className="execution-report">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Execution Report Yet</h3>
          <p>Submit orders to see the execution report here</p>
        </div>
      </div>
    );
  }

  // Separate buy and sell orders
  const buyOrders = report.filter(r => r[' Side'] === '1' || r[' Side'] === 1);
  const sellOrders = report.filter(r => r[' Side'] === '2' || r[' Side'] === 2);

  // Calculate statistics
  const stats = {
    total: report.length,
    filled: report.filter(r => r['Execution Status'] === 'Fill').length,
    partial: report.filter(r => r['Execution Status'] === 'PFill').length,
    new: report.filter(r => r['Execution Status'] === 'New').length,
    rejected: report.filter(r => r['Execution Status'] === 'Rejected').length,
  };

  return (
    <div className="execution-report">
      <div className="report-header">
        <h2>📊 Order Book</h2>
        <p>Current buy and sell orders</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Executions</div>
        </div>
        <div className="stat-card fill">
          <div className="stat-value">{stats.filled}</div>
          <div className="stat-label">Filled</div>
        </div>
        <div className="stat-card pfill">
          <div className="stat-value">{stats.partial}</div>
          <div className="stat-label">Partial Fill</div>
        </div>
        <div className="stat-card new">
          <div className="stat-value">{stats.new}</div>
          <div className="stat-label">New</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      <div className="orderbook-container">
        <div className="orderbook-side buy-side">
          <div className="orderbook-header buy-header">
            <h3>📈 Buy Orders</h3>
          </div>
          <table className="orderbook-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client ID</th>
                <th>Instrument</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {buyOrders.length > 0 ? (
                buyOrders.map((row, index) => (
                  <tr key={index} className="table-row">
                    <td className="order-id">{row['Order ID']}</td>
                    <td>{row[' Client Order ID']}</td>
                    <td>
                      <span className="instrument-badge">
                        {row[' Instrument']}
                      </span>
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusIcon(row[' Execution Status'])}
                        {getStatusBadge(row[' Execution Status'])}
                      </div>
                    </td>
                    <td className="quantity">{row[' Quantity']}</td>
                    <td className="price">${parseFloat(row[' Price']).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">No buy orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="orderbook-divider"></div>

        <div className="orderbook-side sell-side">
          <div className="orderbook-header sell-header">
            <h3>📉 Sell Orders</h3>
          </div>
          <table className="orderbook-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client ID</th>
                <th>Instrument</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {sellOrders.length > 0 ? (
                sellOrders.map((row, index) => (
                  <tr key={index} className="table-row">
                    <td className="order-id">{row['Order ID']}</td>
                    <td>{row[' Client Order ID']}</td>
                    <td>
                      <span className="instrument-badge">
                        {row[' Instrument']}
                      </span>
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusIcon(row[' Execution Status'])}
                        {getStatusBadge(row[' Execution Status'])}
                      </div>
                    </td>
                    <td className="quantity">{row[' Quantity']}</td>
                    <td className="price">${parseFloat(row[' Price']).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">No sell orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ExecutionReport;
