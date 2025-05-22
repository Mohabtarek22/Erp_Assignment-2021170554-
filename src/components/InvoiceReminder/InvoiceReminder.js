import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/InvoiceReminder.css';

const InvoiceReminder = () => {
  const [reminder, setReminder] = useState({
    invoiceId: '',
    dueDate: '',
    clientEmail: '',
    clientPhone: '',
    notificationType: 'email',
    message: '',
  });
  const [message, setMessage] = useState('');
  const [reminderHistory, setReminderHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!reminder.invoiceId || !reminder.dueDate) {
      setMessage('Please enter invoice ID and due date');
      return;
    }

    if (reminder.notificationType === 'email' && !reminder.clientEmail) {
      setMessage('Please enter client email for email notification');
      return;
    }

    if (reminder.notificationType === 'sms' && !reminder.clientPhone) {
      setMessage('Please enter client phone number for SMS notification');
      return;
    }

    const newReminder = {
      ...reminder,
      id: Date.now(),
      status: 'sent',
      sentDate: new Date().toLocaleString()
    };

    setReminderHistory([...reminderHistory, newReminder]);
    
    // Clear form
    setReminder({
      invoiceId: '',
      dueDate: '',
      clientEmail: '',
      clientPhone: '',
      notificationType: 'email',
      message: '',
    });
    
    setMessage('Reminder sent successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getDefaultMessage = () => {
    const daysUntilDue = Math.ceil((new Date(reminder.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 0) {
      return `This is a reminder that your invoice ${reminder.invoiceId} is overdue by ${Math.abs(daysUntilDue)} days. Please process the payment as soon as possible.`;
    } else if (daysUntilDue === 0) {
      return `This is a reminder that your invoice ${reminder.invoiceId} is due today. Please process the payment to avoid any late fees.`;
    } else {
      return `This is a reminder that your invoice ${reminder.invoiceId} is due in ${daysUntilDue} days. Please process the payment before the due date.`;
    }
  };

  return (
    <div className="invoice-reminder">
      <h2>Invoice Due Reminder</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Invoice ID:</label>
          <input
            type="text"
            placeholder="Enter invoice ID"
            value={reminder.invoiceId}
            onChange={(e) => setReminder({ ...reminder, invoiceId: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            value={reminder.dueDate}
            onChange={(e) => setReminder({ ...reminder, dueDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Notification Type:</label>
          <select
            value={reminder.notificationType}
            onChange={(e) => setReminder({ ...reminder, notificationType: e.target.value })}
            required
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="in-app">In-App</option>
          </select>
        </div>

        {reminder.notificationType === 'email' && (
          <div className="form-group">
            <label>Client Email:</label>
            <input
              type="email"
              placeholder="Enter client email"
              value={reminder.clientEmail}
              onChange={(e) => setReminder({ ...reminder, clientEmail: e.target.value })}
              required
            />
          </div>
        )}

        {reminder.notificationType === 'sms' && (
          <div className="form-group">
            <label>Client Phone:</label>
            <input
              type="tel"
              placeholder="Enter client phone number"
              value={reminder.clientPhone}
              onChange={(e) => setReminder({ ...reminder, clientPhone: e.target.value })}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Message:</label>
          <textarea
            placeholder="Enter reminder message"
            value={reminder.message}
            onChange={(e) => setReminder({ ...reminder, message: e.target.value })}
            rows="4"
          />
          <button
            type="button"
            className="default-message-button"
            onClick={() => setReminder({ ...reminder, message: getDefaultMessage() })}
          >
            Use Default Message
          </button>
        </div>

        <button type="submit" className="send-button">Send Reminder</button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {reminderHistory.length > 0 && (
        <div className="reminder-history">
          <h3>Recent Reminders</h3>
          <div className="history-list">
            {reminderHistory.map((rem) => (
              <div key={rem.id} className="history-item">
                <p><strong>Invoice ID:</strong> {rem.invoiceId}</p>
                <p><strong>Due Date:</strong> {rem.dueDate}</p>
                <p><strong>Type:</strong> {rem.notificationType}</p>
                <p><strong>Contact:</strong> {rem.notificationType === 'email' ? rem.clientEmail : rem.clientPhone}</p>
                <p><strong>Sent:</strong> {rem.sentDate}</p>
                <p><strong>Status:</strong> {rem.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceReminder;