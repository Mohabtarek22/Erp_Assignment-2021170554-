import React from 'react';
import CostEntry from './components/CostEntry/CostEntry';
import InvoiceGeneration from './components/InvoiceGeneration/InvoiceGeneration';
import InvoiceEdit from './components/InvoiceEdit/InvoiceEdit';
import InvoiceReminder from './components/InvoiceReminder/InvoiceReminder';
import TaxCalculation from './components/TaxCalculation/TaxCalculation';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Cost Management System</h1>
      <div className="components-grid">
        <CostEntry />
        <InvoiceGeneration />
        <InvoiceEdit />
        <InvoiceReminder />
        <TaxCalculation />
      </div>
    </div>
  );
}

export default App;