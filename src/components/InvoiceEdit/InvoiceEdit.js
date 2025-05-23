import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/InvoiceEdit.css';

const InvoiceEdit = ({ invoices, onUpdateInvoice }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [message, setMessage] = useState('');

  const handleSearch = () => {
    const foundInvoice = invoices.find(inv => 
      inv.id === searchId || inv.invoiceId === searchId
    );
    if (foundInvoice) {
      setSelectedInvoice(foundInvoice);
      setMessage('');
    } else {
      setSelectedInvoice(null);
      setMessage('Invoice not found');
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!selectedInvoice) {
      setMessage('No invoice selected');
      return;
    }

    // Validate inputs
    if (!selectedInvoice.clientId || !selectedInvoice.clientName) {
      setMessage('Please enter client details');
      return;
    }

    if (selectedInvoice.items.some(item => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      setMessage('Please fill in all item details correctly');
      return;
    }

    const updatedInvoice = {
      ...selectedInvoice,
      subtotal: calculateSubtotal(selectedInvoice),
      total: calculateTotal(selectedInvoice),
      lastModified: new Date().toLocaleString()
    };

    onUpdateInvoice(updatedInvoice);
    setMessage('Invoice updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const calculateSubtotal = (invoice) => {
    return invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
  };

  const calculateTotal = (invoice) => {
    const subtotal = calculateSubtotal(invoice);
    const taxAmount = (subtotal * invoice.tax) / 100;
    const discountAmount = (subtotal * invoice.discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const handleAddItem = () => {
    setSelectedInvoice({
      ...selectedInvoice,
      items: [...selectedInvoice.items, { name: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = selectedInvoice.items.filter((_, i) => i !== index);
    setSelectedInvoice({ ...selectedInvoice, items: newItems });
  };

  return (
    <div className="invoice-edit">
      <h2>Edit Invoice</h2>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Invoice ID or Number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {selectedInvoice && (
        <form onSubmit={handleUpdate}>
          <div className="client-details">
            <div className="form-group">
              <label>Invoice ID:</label>
              <input
                type="text"
                value={selectedInvoice.id}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Invoice Number:</label>
              <input
                type="text"
                value={selectedInvoice.invoiceId}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Client ID:</label>
              <input
                type="text"
                value={selectedInvoice.clientId}
                onChange={(e) => setSelectedInvoice({
                  ...selectedInvoice,
                  clientId: e.target.value
                })}
                required
              />
            </div>
            <div className="form-group">
              <label>Client Name:</label>
              <input
                type="text"
                value={selectedInvoice.clientName}
                onChange={(e) => setSelectedInvoice({
                  ...selectedInvoice,
                  clientName: e.target.value
                })}
                required
              />
            </div>
          </div>

          <div className="items-section">
            <h3>Items</h3>
            {selectedInvoice.items.map((item, index) => (
              <div key={index} className="invoice-item">
                <div className="form-group">
                  <label>Item Name:</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...selectedInvoice.items];
                      newItems[index].name = e.target.value;
                      setSelectedInvoice({ ...selectedInvoice, items: newItems });
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => {
                      const newItems = [...selectedInvoice.items];
                      newItems[index].quantity = parseInt(e.target.value);
                      setSelectedInvoice({ ...selectedInvoice, items: newItems });
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit Price ($):</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    min="0"
                    step="0.01"
                    onChange={(e) => {
                      const newItems = [...selectedInvoice.items];
                      newItems[index].unitPrice = parseFloat(e.target.value);
                      setSelectedInvoice({ ...selectedInvoice, items: newItems });
                    }}
                    required
                  />
                </div>
                {selectedInvoice.items.length > 1 && (
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
                value={selectedInvoice.tax}
                min="0"
                max="100"
                onChange={(e) => setSelectedInvoice({
                  ...selectedInvoice,
                  tax: parseFloat(e.target.value)
                })}
              />
            </div>
            <div className="form-group">
              <label>Discount (%):</label>
              <input
                type="number"
                value={selectedInvoice.discount}
                min="0"
                max="100"
                onChange={(e) => setSelectedInvoice({
                  ...selectedInvoice,
                  discount: parseFloat(e.target.value)
                })}
              />
            </div>
          </div>

          <div className="invoice-summary">
            <p><strong>Subtotal:</strong> ${calculateSubtotal(selectedInvoice).toFixed(2)}</p>
            <p><strong>Tax Amount:</strong> ${((calculateSubtotal(selectedInvoice) * selectedInvoice.tax) / 100).toFixed(2)}</p>
            <p><strong>Discount Amount:</strong> ${((calculateSubtotal(selectedInvoice) * selectedInvoice.discount) / 100).toFixed(2)}</p>
            <p><strong>Total:</strong> ${calculateTotal(selectedInvoice).toFixed(2)}</p>
          </div>

          <button type="submit" className="update-button">Update Invoice</button>
        </form>
      )}
    </div>
  );
};

export default InvoiceEdit;