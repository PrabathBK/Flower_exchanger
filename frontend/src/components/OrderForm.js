import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaRocket, FaUpload } from 'react-icons/fa';
import './OrderForm.css';

const API_URL = 'http://localhost:3001/api';

function OrderForm({ onSubmit, loading, setLoading }) {
  const [orders, setOrders] = useState([
    { clientOrderId: '', instrument: 'Rose', side: '1', quantity: '', price: '' }
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const instruments = ['Rose', 'Lavender', 'Tulip', 'Orchid', 'Lotus'];

  const addOrder = () => {
    setOrders([...orders, { clientOrderId: '', instrument: 'Rose', side: '1', quantity: '', price: '' }]);
  };

  const removeOrder = (index) => {
    const newOrders = orders.filter((_, i) => i !== index);
    setOrders(newOrders.length > 0 ? newOrders : [{ clientOrderId: '', instrument: 'Rose', side: '1', quantity: '', price: '' }]);
  };

  const updateOrder = (index, field, value) => {
    const newOrders = [...orders];
    newOrders[index][field] = value;
    setOrders(newOrders);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/orders`, { orders });
      
      if (response.data.success) {
        setSuccess('Orders executed successfully! ✅');
        onSubmit(response.data.executionReport);
        
        // Reset form
        setOrders([{ clientOrderId: '', instrument: 'Rose', side: '1', quantity: '', price: '' }]);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute orders. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccess('File processed successfully! ✅');
        onSubmit(response.data.executionReport);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process file');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="order-form">
      <div className="form-header">
        <h2>📝 Place Your Orders</h2>
        <p>Create buy or sell orders for flower instruments</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="orders-container">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <span className="order-number">Order #{index + 1}</span>
                {orders.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeOrder(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Client Order ID</label>
                  <input
                    type="text"
                    value={order.clientOrderId}
                    onChange={(e) => updateOrder(index, 'clientOrderId', e.target.value)}
                    placeholder="e.g., aa13"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Instrument</label>
                  <select
                    value={order.instrument}
                    onChange={(e) => updateOrder(index, 'instrument', e.target.value)}
                    required
                  >
                    {instruments.map(inst => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Side</label>
                  <select
                    value={order.side}
                    onChange={(e) => updateOrder(index, 'side', e.target.value)}
                    required
                  >
                    <option value="1">Buy 📈</option>
                    <option value="2">Sell 📉</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={order.quantity}
                    onChange={(e) => updateOrder(index, 'quantity', e.target.value)}
                    placeholder="e.g., 100"
                    min="10"
                    step="10"
                    max="999"
                    required
                  />
                  <small>Must be multiple of 10</small>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={order.price}
                    onChange={(e) => updateOrder(index, 'price', e.target.value)}
                    placeholder="e.g., 55.5"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addOrder}
          >
            <FaPlus /> Add Another Order
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : <><FaRocket /> Execute Orders</>}
          </button>
        </div>
      </form>

      <div className="file-upload-section">
        <div className="divider">
          <span>OR</span>
        </div>
        
        <div className="upload-area">
          <FaUpload className="upload-icon" />
          <h3>Upload CSV File</h3>
          <p>Upload a CSV file with your orders</p>
          <label className="btn btn-outline">
            Choose File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
