import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import UserList from './components/Users/UserList';
import './App.css';

// Debug initialization
console.log('App initializing on:', window.location.hostname);
console.log('App origin:', window.location.origin);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    // Log initialization info
    console.log('App component mounted');
    console.log('Environment:', import.meta.env.MODE);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="dashboard-container">
                  <Header />
                  <main className="dashboard-content">
                    <UserList />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
