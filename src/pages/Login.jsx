// ==========================================
// MODULE VI: Forms & Events, Controlled vs uncontrolled inputs
// MODULE VII: React Router Hooks (Navigation Control)
// ==========================================
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Store, ArrowRight, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { loginStudent, loginCanteen } = useAuth();
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'canteen'
  const [error, setError] = useState('');

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentId, setStudentId] = useState('');

  // Canteen Form State
  const [canteenPassword, setCanteenPassword] = useState('');

  // Module VI: Form Handling & Synthetic Events
  const handleStudentLogin = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!studentName || !mobileNumber || !studentId) {
      setError('All fields are required.');
      return;
    }

    const numberRegex = /^252U1R\d{4}$/;
    if (!numberRegex.test(studentId)) {
      setError('Student ID must be in format 252U1RXXXX');
      return;
    }

    loginStudent(studentName, mobileNumber, studentId);
  };

  const handleCanteenLogin = (e) => {
    e.preventDefault();
    setError('');

    if (canteenPassword !== 'Canteen@team') {
      setError('Invalid canteen password.');
      return;
    }

    loginCanteen();
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <h2>Welcome to SmartCanteen</h2>
          <p>Sign in to continue</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => { setActiveTab('student'); setError(''); }}
          >
            <GraduationCap size={20} />
            Student
          </button>
          <button 
            className={`tab-btn ${activeTab === 'canteen' ? 'active' : ''}`}
            onClick={() => { setActiveTab('canteen'); setError(''); }}
          >
            <Store size={20} />
            Canteen Team
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {activeTab === 'student' ? (
          <form onSubmit={handleStudentLogin} className="login-form">
            {/* Module VI: Controlled vs Uncontrolled inputs (Controlled input using value & onChange) */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Student ID</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="252U1RXXXX"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-4">
              Student Login <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleCanteenLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Admin Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter team password"
                value={canteenPassword}
                onChange={(e) => setCanteenPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-4">
              Team Login <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;