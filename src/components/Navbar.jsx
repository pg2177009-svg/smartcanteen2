import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Coffee } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar-wrapper container">
      <nav className="navbar glass-panel">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-icon-wrapper">
              <Coffee className="brand-icon" />
            </div>
            <span className="brand-text">SmartCanteen</span>
          </div>
        
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-greeting">Welcome,</span>
            <span className="user-name">{user?.name}</span>
            {user?.role === 'student' && (
              <span className="user-badge">{user?.studentId}</span>
            )}
          </div>
          <button className="btn btn-secondary btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;