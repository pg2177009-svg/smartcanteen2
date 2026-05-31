// ==========================================
// MODULE I: JSX Components, Reusability, Lists, Keys
// MODULE II: State Management, Conditional Rendering, Multiple States
// MODULE IV: Updating objects/lists in state
// MODULE VI: Effect Hook (Making API Calls), Third-Party Packages (React Spinner), Schedulers (setTimeout), Event Handling
// ==========================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { ShoppingBag, Clock, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { PulseLoader } from 'react-spinners'; // Module VI: Third-Party Packages: React Spinner
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { menu, placeOrder, getEstimatedTime, orders, dismissOrder } = useOrder();
  
  // Module II: Maintaining Multiple States
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('nonVeg');
  
  // Module VI: State for simulating API Call loading
  const [isLoading, setIsLoading] = useState(true);

  // Module VI: Schedulers with Hooks & Mock API Call
  // Effect Hook: Execution Context for component mount
  useEffect(() => {
    // Scheduler methods: setTimeout
    const timer = setTimeout(() => {
      setIsLoading(false); // Setter Function
    }, 800); // Simulate network delay
    
    // Schedulers with Hooks: Clearing Intervals/Timeouts
    return () => clearTimeout(timer);
  }, []);
  
  // My pending orders
  const myPendingOrders = orders.filter(
    o => o.student.studentId === user.studentId && o.status === 'pending'
  );

  // My ready orders
  const myCompletedOrders = orders.filter(
    o => o.student.studentId === user.studentId && o.status === 'completed'
  );

  const categories = [
    { id: 'nonVeg', label: 'Non-Veg Starters & Mains' },
    { id: 'veg', label: 'Veg Delights' },
    { id: 'drinks', label: 'Beverages' },
    { id: 'iceCreams', label: 'Ice Creams' },
  ];

  // Module VI: Event Handling & Synthetic Events
  const addToCart = (item) => {
    // Module IV: Updating objects/lists in state (immutability)
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing.qty === 1) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    placeOrder(user, cart);
    setCart([]);
  };

  const { ordersAhead, estimatedMinutes } = getEstimatedTime(user.studentId);

  // Module II: Conditional Rendering (if-else equivalent using early return)
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        {/* Module VI: React Spinner */}
        <PulseLoader color="#6366f1" size={15} />
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Left Column: Menu */}
      <div className="menu-section">
        <div className="category-tabs glass-panel">
          {/* Module I & IV: Lists, Keys, Reusability */}
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {menu[activeCategory].map(item => (
            <div key={item.id} className="menu-card glass-panel animate-fade-in">
              <div className="menu-img-container">
                {item.image && <img src={item.image} alt={item.name} className="menu-img" />}
              </div>
              <div className="menu-info">
                <h3>{item.name}</h3>
                <span className="price">₹{item.price}</span>
              </div>
              <button 
                className="btn btn-primary add-btn"
                onClick={() => addToCart(item)}
              >
                <Plus size={16} /> Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Cart & Tracking */}
      <div className="sidebar-section">
        
        {/* Ready Orders Widget */}
        {myCompletedOrders.length > 0 && (
          <div className="tracking-widget glass-panel animate-fade-in" style={{ borderTopColor: '#10b981', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
            <div className="tracking-header">
              <CheckCircle2 color="#10b981" />
              <h3 style={{ color: '#10b981' }}>Order Ready!</h3>
            </div>
            <div className="ready-orders-list">
              {myCompletedOrders.map(order => (
                <div key={order.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{order.id}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Your order is ready for pickup at the canteen counter.
                  </p>
                  <button 
                    className="btn btn-secondary w-100" 
                    onClick={() => dismissOrder(order.id)}
                  >
                    Got it!
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking Widget */}
        {myPendingOrders.length > 0 && (
          <div className="tracking-widget glass-panel animate-fade-in">
            <div className="tracking-header">
              <Clock className="text-warning" />
              <h3>Order Status</h3>
            </div>
            <div className="tracking-stats">
              <div className="stat-box">
                <span className="stat-value">{ordersAhead}</span>
                <span className="stat-label">Orders Ahead</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{estimatedMinutes}</span>
                <span className="stat-label">Est. Mins</span>
              </div>
            </div>
            <div className="my-order-summary">
              <p>Waiting on {myPendingOrders.length} order(s).</p>
            </div>
          </div>
        )}

        {/* Cart Widget */}
        <div className="cart-widget glass-panel">
          <div className="cart-header">
            <ShoppingBag />
            <h3>Your Cart</h3>
          </div>
          
          {/* Module II: Conditional Rendering using element variables / ternary operator */}
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <p>Add some delicious food!</p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                  <div className="qty-controls">
                    <button onClick={() => removeFromCart(item.id)}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => addToCart(item)}><Plus size={14} /></button>
                  </div>
                </div>
              ))}
              
              <div className="cart-total">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              
              <button 
                className="btn btn-success w-100 place-order-btn"
                onClick={handlePlaceOrder}
              >
                <CheckCircle2 size={18} />
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;