import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/TaxCalculation.css';

const TaxCalculation = () => {
  const [taxInput, setTaxInput] = useState({
    subtotal: 0,
    region: '',
    taxType: 'standard'
  });

  const [taxResult, setTaxResult] = useState(null);
  const [message, setMessage] = useState('');

  // Regional tax rules
  const taxRules = {
    'US': {
      standard: 0.07, // 7%
      reduced: 0.04,  // 4%
      luxury: 0.12    // 12%
    },
    'EU': {
      standard: 0.20, // 20%
      reduced: 0.10,  // 10%
      luxury: 0.25    // 25%
    },
    'UK': {
      standard: 0.20, // 20%
      reduced: 0.05,  // 5%
      luxury: 0.25    // 25%
    },
    'CA': {
      standard: 0.13, // 13%
      reduced: 0.05,  // 5%
      luxury: 0.15    // 15%
    }
  };

  const calculateTax = (subtotal, region, taxType) => {
    if (!region || !taxType || !taxRules[region]) {
      return null;
    }

    const rate = taxRules[region][taxType];
    const taxAmount = subtotal * rate;
    const total = subtotal + taxAmount;

    return {
      subtotal,
      taxRate: rate * 100,
      taxAmount,
      total
    };
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    if (!taxInput.subtotal || !taxInput.region || !taxInput.taxType) {
      setMessage('Please fill in all required fields');
      return;
    }

    const result = calculateTax(
      parseFloat(taxInput.subtotal),
      taxInput.region,
      taxInput.taxType
    );

    if (result) {
      setTaxResult(result);
      setMessage('Tax calculated successfully!');
    } else {
      setMessage('Invalid tax calculation parameters');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    setTaxInput({
      subtotal: 0,
      region: '',
      taxType: 'standard'
    });
    setTaxResult(null);
    setMessage('Calculation reset');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="tax-calculation">
      <h2>Tax Calculator</h2>
      <form onSubmit={handleCalculate}>
        <div className="form-group">
          <label>Subtotal ($):</label>
          <input
            type="number"
            placeholder="Enter subtotal amount"
            value={taxInput.subtotal}
            min="0"
            step="0.01"
            onChange={(e) => setTaxInput({ ...taxInput, subtotal: e.target.value })}
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
            <option value="">Select Region</option>
            <option value="US">United States</option>
            <option value="EU">European Union</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tax Type:</label>
          <select
            value={taxInput.taxType}
            onChange={(e) => setTaxInput({ ...taxInput, taxType: e.target.value })}
            required
          >
            <option value="standard">Standard Rate</option>
            <option value="reduced">Reduced Rate</option>
            <option value="luxury">Luxury Rate</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="calculate-button">Calculate Tax</button>
          <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {taxResult && (
        <div className="tax-result">
          <h3>Tax Calculation Result</h3>
          <div className="result-details">
            <p><strong>Subtotal:</strong> ${taxResult.subtotal.toFixed(2)}</p>
            <p><strong>Tax Rate:</strong> {taxResult.taxRate.toFixed(1)}%</p>
            <p><strong>Tax Amount:</strong> ${taxResult.taxAmount.toFixed(2)}</p>
            <p className="total"><strong>Total:</strong> ${taxResult.total.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="tax-rules">
        <h3>Regional Tax Rules</h3>
        <div className="rules-grid">
          {Object.entries(taxRules).map(([region, rates]) => (
            <div key={region} className="region-card">
              <h4>{region}</h4>
              <ul>
                <li>Standard Rate: {(rates.standard * 100).toFixed(1)}%</li>
                <li>Reduced Rate: {(rates.reduced * 100).toFixed(1)}%</li>
                <li>Luxury Rate: {(rates.luxury * 100).toFixed(1)}%</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculation;