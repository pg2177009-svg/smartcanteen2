import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { Check, Clock, Package } from 'lucide-react';
import './CanteenDashboard.css';

const CanteenDashboard = () => {
  const { getPendingOrders, markOrderCompleted, orders } = useOrder();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed'

  const pendingOrders = getPendingOrders();
  const completedOrders = orders.filter(o => o.status === 'completed');

  const displayOrders = activeTab === 'pending' ? pendingOrders : completedOrders;

  // Format timestamp
  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="canteen-dashboard">
      <div className="dashboard-header glass-panel">
        <div className="header-content">
          <h2>Order Queue</h2>
          <div className="queue-stats">
            <span className="badge badge-warning">
              {pendingOrders.length} Pending
            </span>
            <span className="badge badge-success">
              {completedOrders.length} Completed
            </span>
          </div>
        </div>

        <div className="queue-tabs">
          <button 
            className={`q-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={16} /> Pending Orders
          </button>
          <button 
            className={`q-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <Package size={16} /> Order History
          </button>
        </div>
      </div>

      <div className="orders-grid">
        {displayOrders.length === 0 ? (
          <div className="empty-state glass-panel">
            <Package size={48} className="empty-icon" />
            <h3>No {activeTab} orders</h3>
            <p>Waiting for students to place new orders...</p>
          </div>
        ) : (
          displayOrders.map(order => (
            <div key={order.id} className="order-card glass-panel animate-fade-in">
              <div className="order-header">
                <div className="order-id">
                  <span className="id-text">{order.id}</span>
                  <span className="time-text">{formatTime(order.timestamp)}</span>
                </div>
                {order.status === 'pending' && (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => markOrderCompleted(order.id)}
                  >
                    <Check size={16} /> Complete
                  </button>
                )}
              </div>

              <div className="student-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{order.student.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Mob / ID:</span>
                  <span className="value">{order.student.mobileNumber} | {order.student.studentId}</span>
                </div>
              </div>

              <div className="order-items">
                <h4>Ordered Items</h4>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      <span className="item-qty">{item.qty}x</span>
                      <span className="item-name">{item.name}</span>
                    </li>
                  ))}
                </ul>
                <div className="order-total">
                  Total: ₹{order.items.reduce((sum, item) => sum + (item.price * item.qty), 0)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CanteenDashboard;