import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/CostEntry.css';

const CostEntry = () => {
  const [cost, setCost] = useState({
    category: '',
    amount: '',
    date: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [costHistory, setCostHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!cost.category || !cost.amount || !cost.date || !cost.description) {
      setMessage('Please fill in all fields');
      return;
    }

    if (isNaN(cost.amount) || cost.amount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    // Create cost record
    const costRecord = {
      ...cost,
      id: Date.now(),
      timestamp: new Date().toLocaleString()
    };

    // Add to history
    setCostHistory([...costHistory, costRecord]);
    
    // Clear form
    setCost({
      category: '',
      amount: '',
      date: '',
      description: ''
    });
    
    setMessage('Cost logged successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="cost-entry">
      <h2>Cost Entry</h2>
      <form onSubmit={handleSubmit}>
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
            <option value="salaries">Salaries</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount ($):</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={cost.amount}
            onChange={(e) => setCost({ ...cost, amount: e.target.value })}
            min="0"
            step="0.01"
            required
          />
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
          <label>Description:</label>
          <textarea
            placeholder="Enter cost description"
            value={cost.description}
            onChange={(e) => setCost({ ...cost, description: e.target.value })}
            required
          />
        </div>

        <button type="submit">Log Cost</button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {costHistory.length > 0 && (
        <div className="cost-history">
          <h3>Recent Cost Entries</h3>
          <div className="history-list">
            {costHistory.map((record) => (
              <div key={record.id} className="history-item">
                <p><strong>Category:</strong> {record.category}</p>
                <p><strong>Amount:</strong> ${record.amount}</p>
                <p><strong>Date:</strong> {record.date}</p>
                <p><strong>Description:</strong> {record.description}</p>
                <p><strong>Logged:</strong> {record.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CostEntry;