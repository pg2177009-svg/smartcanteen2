import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CanteenDashboard from './pages/CanteenDashboard';

// ==========================================
// MODULE VI: React Router & Routing
// MODULE VIII: Protected Routes & Wrapper Components
// MODULE IX: Context API (Providers)
// ==========================================

// Wrapper Component for Protected Routes (Module VIII)
const ProtectedRoute = ({ children, allowedRole }) => {
  // Context API: Consumer using useContext (Module IX)
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their respective dashboard if they try to access the wrong one
    return <Navigate to={user.role === 'student' ? '/student' : '/canteen'} replace />;
  }
  
  return children;
};

// Main App Component with Providers
const AppContent = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <main className="container" style={{ paddingBottom: '2rem' }}>
        <Routes>
          {/* Module VI: React Router Components (Routes, Route, Navigate) */}
          <Route path="/login" element={
            !user ? <Login /> : <Navigate to={user.role === 'student' ? '/student' : '/canteen'} />
          } />
          
          <Route path="/student" element={
            /* Module VIII: Integrating Protected Route */
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/canteen" element={
            <ProtectedRoute allowedRole="canteen">
              <CanteenDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    /* Module IX: Context API Providers wrapping the app */
    <AuthProvider>
      <OrderProvider>
        {/* Module VI: Single Page Application Routing */}
        <Router>
          <AppContent />
        </Router>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;