import React, { useState } from 'react';
import './App.css';
import InvoiceGeneration from './components/InvoiceGeneration/InvoiceGeneration';
import InvoiceEdit from './components/InvoiceEdit/InvoiceEdit';
import CostEntry from './components/CostEntry/CostEntry';
import InvoiceReminder from './components/InvoiceReminder/InvoiceReminder';
import TaxCalculation from './components/TaxCalculation/TaxCalculation';

function App() {
  const [invoices, setInvoices] = useState([]);

  const handleAddInvoice = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
  };

  const handleUpdateInvoice = (updatedInvoice) => {
    setInvoices(invoices.map(inv => 
      inv.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : inv
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cost Management System</h1>
      </header>
      <main className="components-grid">
        <div className="component-section">
          <InvoiceGeneration onAddInvoice={handleAddInvoice} invoices={invoices} />
        </div>
        <div className="component-section">
          <InvoiceEdit invoices={invoices} onUpdateInvoice={handleUpdateInvoice} />
        </div>
        <div className="component-section">
          <CostEntry />
        </div>
        <div className="component-section">
          <InvoiceReminder />
        </div>
        <div className="component-section">
          <TaxCalculation />
        </div>
      </main>
    </div>
  );
}

export default App;