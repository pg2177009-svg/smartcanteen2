// ==========================================
// MODULE VII: Authentication & Authorization, Storage Mechanisms
// MODULE IX: Context API
// ==========================================
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('canteen_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Module VII: Authentication flow & Storage Mechanisms
  const loginStudent = (name, mobileNumber, studentId) => {
    // In a real app, this would be a JWT Token (Module VII: JWT Token)
    const studentUser = { role: 'student', name, mobileNumber, studentId, token: 'fake-jwt-token-xyz' };
    setUser(studentUser);
    localStorage.setItem('canteen_user', JSON.stringify(studentUser));
  };

  const loginCanteen = () => {
    const canteenUser = { role: 'canteen', name: 'Canteen Team', token: 'fake-jwt-admin-token' };
    setUser(canteenUser);
    localStorage.setItem('canteen_user', JSON.stringify(canteenUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('canteen_user');
  };

  return (
    <AuthContext.Provider value={{ user, loginStudent, loginCanteen, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);