import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/CostEntry.css';

const CostEntry = () => {
  const [cost, setCost] = useState({
    costId: '',
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentStatus: 'pending'
  });
  const [costs, setCosts] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!cost.costId || !cost.description || cost.amount <= 0 || !cost.category) {
      setMessage('Please fill in all required fields correctly');
      return;
    }

    // Check if cost ID already exists
    if (costs.some(c => c.costId === cost.costId)) {
      setMessage('Cost ID already exists. Please use a different ID.');
      return;
    }

    const newCost = {
      ...cost,
      date: new Date().toLocaleString()
    };

    setCosts([...costs, newCost]);
    
    // Clear form
    setCost({
      costId: '',
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'pending'
    });
    
    setMessage('Cost entry added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = (costId) => {
    setCosts(costs.filter(c => c.costId !== costId));
    setMessage('Cost entry deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStatusChange = (costId, newStatus) => {
    setCosts(costs.map(c => 
      c.costId === costId ? { ...c, paymentStatus: newStatus } : c
    ));
  };

  return (
    <div className="cost-entry">
      <h2>Cost Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cost ID:</label>
          <input
            type="text"
            placeholder="Enter cost ID"
            value={cost.costId}
            onChange={(e) => setCost({ ...cost, costId: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Enter cost description"
            value={cost.description}
            onChange={(e) => setCost({ ...cost, description: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount ($):</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={cost.amount}
            min="0"
            step="0.01"
            onChange={(e) => setCost({ ...cost, amount: parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={cost.category}
            onChange={(e) => setCost({ ...cost, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            <option value="utilities">Utilities</option>
            <option value="rent">Rent</option>
            <option value="supplies">Supplies</option>
            <option value="maintenance">Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={cost.date}
            onChange={(e) => setCost({ ...cost, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Status:</label>
          <select
            value={cost.paymentStatus}
            onChange={(e) => setCost({ ...cost, paymentStatus: e.target.value })}
            required
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add Cost Entry</button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {costs.length > 0 && (
        <div className="costs-list">
          <h3>Cost Entries</h3>
          <div className="costs-grid">
            {costs.map((c) => (
              <div key={c.costId} className="cost-item">
                <p><strong>ID:</strong> {c.costId}</p>
                <p><strong>Description:</strong> {c.description}</p>
                <p><strong>Amount:</strong> ${c.amount.toFixed(2)}</p>
                <p><strong>Category:</strong> {c.category}</p>
                <p><strong>Date:</strong> {c.date}</p>
                <p><strong>Status:</strong> 
                  <select
                    value={c.paymentStatus}
                    onChange={(e) => handleStatusChange(c.costId, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(c.costId)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostEntry;