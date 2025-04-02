import { createContext, useState, useEffect, useContext } from 'react';
import { auth, onAuthStateChanged, loginWithEmailAndPassword, logoutUser } from '../services/firebase';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      await loginWithEmailAndPassword(email, password);
    } catch (err) {
      setError('Failed to login: ' + err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError('');
      await logoutUser();
    } catch (err) {
      setError('Failed to logout: ' + err.message);
      throw err;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 