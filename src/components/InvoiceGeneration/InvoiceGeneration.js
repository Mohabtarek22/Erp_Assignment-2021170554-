import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/InvoiceGeneration.css';

const InvoiceGeneration = () => {
  const [invoice, setInvoice] = useState({
    clientId: '',
    clientName: '',
    items: [{ name: '', quantity: 1, unitPrice: 0 }],
    tax: 0,
    discount: 0,
  });
  const [message, setMessage] = useState('');
  const [invoiceHistory, setInvoiceHistory] = useState([]);

  const handleAddItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { name: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: newItems });
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * invoice.tax) / 100;
    const discountAmount = (subtotal * invoice.discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!invoice.clientId || !invoice.clientName) {
      setMessage('Please enter client details');
      return;
    }

    if (invoice.items.some(item => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      setMessage('Please fill in all item details correctly');
      return;
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const newInvoice = {
      ...invoice,
      invoiceNumber,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
      date: new Date().toLocaleString()
    };

    setInvoiceHistory([...invoiceHistory, newInvoice]);
    
    // Clear form
    setInvoice({
      clientId: '',
      clientName: '',
      items: [{ name: '', quantity: 1, unitPrice: 0 }],
      tax: 0,
      discount: 0,
    });
    
    setMessage('Invoice generated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="invoice-generation">
      <h2>Generate Invoice</h2>
      <form onSubmit={handleSubmit}>
        <div className="client-details">
          <div className="form-group">
            <label>Client ID:</label>
            <input
              type="text"
              placeholder="Enter client ID"
              value={invoice.clientId}
              onChange={(e) => setInvoice({ ...invoice, clientId: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Client Name:</label>
            <input
              type="text"
              placeholder="Enter client name"
              value={invoice.clientName}
              onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="items-section">
          <h3>Items</h3>
          {invoice.items.map((item, index) => (
            <div key={index} className="invoice-item">
              <div className="form-group">
                <label>Item Name:</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...invoice.items];
                    newItems[index].name = e.target.value;
                    setInvoice({ ...invoice, items: newItems });
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => {
                    const newItems = [...invoice.items];
                    newItems[index].quantity = parseInt(e.target.value);
                    setInvoice({ ...invoice, items: newItems });
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit Price ($):</label>
                <input
                  type="number"
                  placeholder="Enter unit price"
                  value={item.unitPrice}
                  min="0"
                  step="0.01"
                  onChange={(e) => {
                    const newItems = [...invoice.items];
                    newItems[index].unitPrice = parseFloat(e.target.value);
                    setInvoice({ ...invoice, items: newItems });
                  }}
                  required
                />
              </div>
              {invoice.items.length > 1 && (
                <button
                  type="button"
                  className="remove-item"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="add-item">
            Add Item
          </button>
        </div>

        <div className="totals-section">
          <div className="form-group">
            <label>Tax (%):</label>
            <input
              type="number"
              placeholder="Enter tax percentage"
              value={invoice.tax}
              min="0"
              max="100"
              onChange={(e) => setInvoice({ ...invoice, tax: parseFloat(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label>Discount (%):</label>
            <input
              type="number"
              placeholder="Enter discount percentage"
              value={invoice.discount}
              min="0"
              max="100"
              onChange={(e) => setInvoice({ ...invoice, discount: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="invoice-summary">
          <p><strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}</p>
          <p><strong>Tax Amount:</strong> ${((calculateSubtotal() * invoice.tax) / 100).toFixed(2)}</p>
          <p><strong>Discount Amount:</strong> ${((calculateSubtotal() * invoice.discount) / 100).toFixed(2)}</p>
          <p><strong>Total:</strong> ${calculateTotal().toFixed(2)}</p>
        </div>

        <button type="submit" className="generate-button">Generate Invoice</button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {invoiceHistory.length > 0 && (
        <div className="invoice-history">
          <h3>Recent Invoices</h3>
          <div className="history-list">
            {invoiceHistory.map((inv) => (
              <div key={inv.invoiceNumber} className="history-item">
                <p><strong>Invoice #:</strong> {inv.invoiceNumber}</p>
                <p><strong>Client:</strong> {inv.clientName}</p>
                <p><strong>Date:</strong> {inv.date}</p>
                <p><strong>Total:</strong> ${inv.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGeneration;