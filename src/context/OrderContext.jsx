// ==========================================
// MODULE II: State Management
// MODULE IV: Unique keys (UUID) package, Updating objects/lists in state
// MODULE V: Effect Hooks, Local Storage, JSON Methods
// MODULE IX & X: Context API
// ==========================================
import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Module IV: Third-party Packages, Unique keys

const OrderContext = createContext();

// Mock menu data as requested
const MOCK_MENU = {
  nonVeg: [
    { id: 'nv1', name: 'Chicken Dum Biryani', price: 200, category: 'nonVeg', image: '/images/biryani.png' },
    { id: 'nv2', name: 'Fry Piece Biriyani', price: 220, category: 'nonVeg', image: '/images/biryani.png' },
    { id: 'nv3', name: 'Chicken Fried Rice', price: 150, category: 'nonVeg', image: '/images/fried_rice.png' },
    { id: 'nv4', name: 'Chicken Noodles', price: 150, category: 'nonVeg', image: '/images/fried_rice.png' },
    { id: 'nv5', name: 'Egg Fried Rice', price: 120, category: 'nonVeg', image: '/images/fried_rice.png' },
    { id: 'nv6', name: 'Chicken Manchuria', price: 180, category: 'nonVeg', image: '/images/fried_rice.png' },
  ],
  veg: [
    { id: 'v1', name: 'Paneer Biryani', price: 180, category: 'veg', image: '/images/biryani.png' },
    { id: 'v2', name: 'Veg Fried Rice', price: 120, category: 'veg', image: '/images/fried_rice.png' },
    { id: 'v3', name: 'Veg Manchuria', price: 140, category: 'veg', image: '/images/fried_rice.png' },
    { id: 'v4', name: 'Veg Noodles', price: 120, category: 'veg', image: '/images/fried_rice.png' },
  ],
  drinks: [
    { id: 'd1', name: 'Cola', price: 40, category: 'drinks', image: '/images/drink.png' },
    { id: 'd2', name: 'Sprite', price: 40, category: 'drinks', image: '/images/drink.png' },
    { id: 'd3', name: 'Thumbs Up', price: 40, category: 'drinks', image: '/images/drink.png' },
  ],
  iceCreams: [
    { id: 'i1', name: 'Vanilla Scoop', price: 50, category: 'iceCreams', image: '/images/icecream.png' },
    { id: 'i2', name: 'Chocolate Cone', price: 70, category: 'iceCreams', image: '/images/icecream.png' },
    { id: 'i3', name: 'Butterscotch', price: 60, category: 'iceCreams', image: '/images/icecream.png' },
  ]
};

export function OrderProvider({ children }) {
  // Module II: Identifying the State
  // Module V: Storage Mechanisms, Local Storage
  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem('canteen_orders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  // Module V: Multiple useEffects
  useEffect(() => {
    // Module V: JSON Methods (JSON.stringify)
    localStorage.setItem('canteen_orders', JSON.stringify(orders));
  }, [orders]); // Dependency Array triggers on 'orders' change

  const placeOrder = (studentDetails, cartItems) => {
    const newOrder = {
      id: uuidv4(), // Module IV: Unique keys (UUID)
      student: studentDetails,
      items: cartItems,
      status: 'pending', 
      timestamp: Date.now()
    };
    // Module IV: Updating List (immutability), State handling best practices
    setOrders(prev => [...prev, newOrder]);
  };

  const markOrderCompleted = (orderId) => {
    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o)
    );
  };

  const dismissOrder = (orderId) => {
    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: 'archived' } : o)
    );
  };

  const getPendingOrders = () => {
    return orders.filter(o => o.status === 'pending');
  };

  // Simple estimate: 5 mins per pending order ahead of you
  const getEstimatedTime = (studentId) => {
    const pending = getPendingOrders();
    const myOrderIndex = pending.findIndex(o => o.student.studentId === studentId);
    
    if (myOrderIndex === -1) return { ordersAhead: 0, estimatedMinutes: 0 };
    
    return {
      ordersAhead: myOrderIndex,
      estimatedMinutes: myOrderIndex * 5 + 5 // +5 for their own order processing
    };
  };

  return (
    <OrderContext.Provider value={{ 
      menu: MOCK_MENU, 
      orders, 
      placeOrder, 
      markOrderCompleted,
      dismissOrder,
      getPendingOrders,
      getEstimatedTime
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);