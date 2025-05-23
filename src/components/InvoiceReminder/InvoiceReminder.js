import React, { useState } from 'react';
import 'C:/Users/mohab/OneDrive/Desktop/ERP_ASSIGNMENT/cost-management-system/src/styles/InvoiceReminder.css';

const InvoiceReminder = () => {
  const [reminder, setReminder] = useState({
    invoiceId: '',
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notificationType: ['email'], // Array to allow multiple notification types
    message: '',
    priority: 'medium'
  });
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!reminder.invoiceId || !reminder.dueDate || !reminder.clientEmail || !reminder.message) {
      setMessage('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reminder.clientEmail)) {
      setMessage('Please enter a valid email address');
      return;
    }

    // Check if reminder already exists for this invoice
    if (reminders.some(r => r.invoiceId === reminder.invoiceId)) {
      setMessage('A reminder already exists for this invoice');
      return;
    }

    const newReminder = {
      ...reminder,
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      status: 'pending',
      notifications: [] // Track sent notifications
    };

    setReminders([...reminders, newReminder]);
    
    // Clear form
    setReminder({
      invoiceId: '',
      dueDate: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      notificationType: ['email'],
      message: '',
      priority: 'medium'
    });
    
    setMessage('Reminder set successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    setMessage('Reminder deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  const handleNotificationTypeChange = (type) => {
    const currentTypes = reminder.notificationType;
    if (currentTypes.includes(type)) {
      setReminder({
        ...reminder,
        notificationType: currentTypes.filter(t => t !== type)
      });
    } else {
      setReminder({
        ...reminder,
        notificationType: [...currentTypes, type]
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'black';
    }
  };

  const sendNotification = (reminderId) => {
    setReminders(reminders.map(r => {
      if (r.id === reminderId) {
        const notification = {
          type: r.notificationType,
          timestamp: new Date().toLocaleString(),
          status: 'sent'
        };
        return {
          ...r,
          notifications: [...(r.notifications || []), notification],
          status: 'sent'
        };
      }
      return r;
    }));
    setMessage('Notification sent successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="invoice-reminder">
      <h2>Invoice Reminders</h2>
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
          <label>Client Name:</label>
          <input
            type="text"
            placeholder="Enter client name"
            value={reminder.clientName}
            onChange={(e) => setReminder({ ...reminder, clientName: e.target.value })}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Client Phone:</label>
          <input
            type="tel"
            placeholder="Enter client phone"
            value={reminder.clientPhone}
            onChange={(e) => setReminder({ ...reminder, clientPhone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Notification Type:</label>
          <div className="notification-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reminder.notificationType.includes('email')}
                onChange={() => handleNotificationTypeChange('email')}
              />
              Email
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reminder.notificationType.includes('sms')}
                onChange={() => handleNotificationTypeChange('sms')}
              />
              SMS
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reminder.notificationType.includes('in-app')}
                onChange={() => handleNotificationTypeChange('in-app')}
              />
              In-App
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            placeholder="Enter reminder message"
            value={reminder.message}
            onChange={(e) => setReminder({ ...reminder, message: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority:</label>
          <select
            value={reminder.priority}
            onChange={(e) => setReminder({ ...reminder, priority: e.target.value })}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Set Reminder</button>
      </form>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {reminders.length > 0 && (
        <div className="reminders-list">
          <h3>Active Reminders</h3>
          <div className="reminders-grid">
            {reminders.map((r) => (
              <div 
                key={r.id} 
                className="reminder-item"
                style={{ borderLeft: `4px solid ${getPriorityColor(r.priority)}` }}
              >
                <p><strong>Invoice ID:</strong> {r.invoiceId}</p>
                <p><strong>Client:</strong> {r.clientName}</p>
                <p><strong>Contact:</strong> {r.clientEmail}</p>
                <p><strong>Due Date:</strong> {r.dueDate}</p>
                <p><strong>Notification Types:</strong> {r.notificationType.join(', ')}</p>
                <p><strong>Message:</strong> {r.message}</p>
                <p><strong>Priority:</strong> {r.priority}</p>
                <p><strong>Created:</strong> {r.createdAt}</p>
                <p><strong>Status:</strong> {r.status}</p>
                {r.notifications && r.notifications.length > 0 && (
                  <div className="notification-history">
                    <h4>Notification History</h4>
                    {r.notifications.map((n, index) => (
                      <p key={index}>
                        {n.type.join(', ')} - {n.timestamp} - {n.status}
                      </p>
                    ))}
                  </div>
                )}
                <div className="reminder-actions">
                  {r.status === 'pending' && (
                    <button
                      className="send-button"
                      onClick={() => sendNotification(r.id)}
                    >
                      Send Notification
                    </button>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceReminder;