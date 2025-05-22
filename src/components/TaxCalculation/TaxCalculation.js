import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/TaxCalculation.css';

const TaxCalculation = () => {
  const [taxInput, setTaxInput] = useState({
    subtotal: '',
    taxRate: '',
    region: 'US',
  });
  const [message, setMessage] = useState('');
  const [calculationHistory, setCalculationHistory] = useState([]);

  const getRegionTaxRates = (region) => {
    const rates = {
      US: {
        default: 0,
        states: {
          CA: 7.25,
          NY: 8.875,
          TX: 6.25,
          FL: 6.00,
          IL: 6.25
        }
      },
      EU: {
        default: 20,
        countries: {
          DE: 19,
          FR: 20,
          IT: 22,
          ES: 21,
          UK: 20
        }
      },
      UK: {
        default: 20,
        regions: {
          England: 20,
          Scotland: 20,
          Wales: 20,
          NorthernIreland: 20
        }
      }
    };
    return rates[region] || rates.US;
  };

  const calculateTax = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!taxInput.subtotal || !taxInput.taxRate) {
      setMessage('Please fill in all required fields');
      return;
    }

    if (isNaN(taxInput.subtotal) || taxInput.subtotal <= 0) {
      setMessage('Please enter a valid subtotal amount');
      return;
    }

    if (isNaN(taxInput.taxRate) || taxInput.taxRate < 0 || taxInput.taxRate > 100) {
      setMessage('Please enter a valid tax rate between 0 and 100');
      return;
    }

    const subtotal = parseFloat(taxInput.subtotal);
    const taxRate = parseFloat(taxInput.taxRate);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const calculation = {
      id: Date.now(),
      subtotal,
      taxRate,
      taxAmount,
      total,
      region: taxInput.region,
      timestamp: new Date().toLocaleString()
    };

    setCalculationHistory([...calculationHistory, calculation]);
    setMessage('Tax calculated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="tax-calculation">
      <h2>Tax Calculation</h2>
      <form onSubmit={calculateTax}>
        <div className="form-group">
          <label>Subtotal ($):</label>
          <input
            type="number"
            placeholder="Enter subtotal amount"
            value={taxInput.subtotal}
            onChange={(e) => setTaxInput({ ...taxInput, subtotal: e.target.value })}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Tax Rate (%):</label>
          <input
            type="number"
            placeholder="Enter tax rate"
            value={taxInput.taxRate}
            onChange={(e) => setTaxInput({ ...taxInput, taxRate: e.target.value })}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Region:</label>
          <select
            value={taxInput.region}
            onChange={(e) => setTaxInput({ ...taxInput, region: e.target.value })}
            required
          >
            <option value="US">United States</option>
            <option value="EU">Europe</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>

        <button type="submit" className="calculate-button">Calculate Tax</button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {calculationHistory.length > 0 && (
        <div className="calculation-history">
          <h3>Recent Calculations</h3>
          <div className="history-list">
            {calculationHistory.map((calc) => (
              <div key={calc.id} className="history-item">
                <p><strong>Region:</strong> {calc.region}</p>
                <p><strong>Subtotal:</strong> ${calc.subtotal.toFixed(2)}</p>
                <p><strong>Tax Rate:</strong> {calc.taxRate}%</p>
                <p><strong>Tax Amount:</strong> ${calc.taxAmount.toFixed(2)}</p>
                <p><strong>Total:</strong> ${calc.total.toFixed(2)}</p>
                <p><strong>Calculated:</strong> {calc.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculation;