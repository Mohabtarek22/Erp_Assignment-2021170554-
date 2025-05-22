import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/InvoiceEdit.css';

const InvoiceEdit = () => {
  const [invoiceId, setInvoiceId] = useState('');
  const [message, setMessage] = useState('');
  const [editHistory, setEditHistory] = useState([]);
  const [invoice, setInvoice] = useState({
    clientId: '',
    clientName: '',
    items: [{ name: '', quantity: 1, unitPrice: 0 }],
    tax: 0,
    discount: 0,
  });

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

  const handleSearchInvoice = (e) => {
    e.preventDefault();
    if (!invoiceId) {
      setMessage('Please enter an invoice ID');
      return;
    }
    // Simulate finding an invoice (in a real app, this would be an API call)
    const mockInvoice = {
      clientId: 'CLI001',
      clientName: 'John Doe',
      items: [
        { name: 'Product A', quantity: 2, unitPrice: 50 },
        { name: 'Product B', quantity: 1, unitPrice: 75 }
      ],
      tax: 10,
      discount: 5
    };
    setInvoice(mockInvoice);
    setMessage('Invoice found! You can now edit it.');
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

    const editedInvoice = {
      ...invoice,
      invoiceId,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
      editDate: new Date().toLocaleString()
    };

    setEditHistory([...editHistory, editedInvoice]);
    
    // Clear form
    setInvoiceId('');
    setInvoice({
      clientId: '',
      clientName: '',
      items: [{ name: '', quantity: 1, unitPrice: 0 }],
      tax: 0,
      discount: 0,
    });
    
    setMessage('Invoice updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="invoice-edit">
      <h2>Edit Invoice</h2>
      
      <form onSubmit={handleSearchInvoice} className="search-form">
        <div className="form-group">
          <label>Invoice ID:</label>
          <input
            type="text"
            placeholder="Enter invoice ID to edit"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="search-button">Search Invoice</button>
      </form>

      {invoice.clientId && (
        <form onSubmit={handleSubmit} className="edit-form">
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
              <div key={index} className="edit-item">
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

          <button type="submit" className="update-button">Update Invoice</button>
        </form>
      )}

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {editHistory.length > 0 && (
        <div className="edit-history">
          <h3>Recent Edits</h3>
          <div className="history-list">
            {editHistory.map((inv, index) => (
              <div key={index} className="history-item">
                <p><strong>Invoice ID:</strong> {inv.invoiceId}</p>
                <p><strong>Client:</strong> {inv.clientName}</p>
                <p><strong>Edited:</strong> {inv.editDate}</p>
                <p><strong>New Total:</strong> ${inv.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceEdit;