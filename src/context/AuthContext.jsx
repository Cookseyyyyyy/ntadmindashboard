import { createContext, useState, useEffect, useContext } from 'react';
import { auth, onAuthStateChanged, loginWithEmailAndPassword, loginWithGoogle, logoutUser } from '../services/firebase';

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

  // Login with email/password
  const login = async (email, password) => {
    try {
      setError('');
      console.log('AuthContext debug - Login attempt');
      await loginWithEmailAndPassword(email, password);
      console.log('AuthContext debug - Login success');
    } catch (err) {
      console.error('AuthContext debug - Login error:', err.message);
      setError('Failed to login: ' + err.message);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogleProvider = async () => {
    try {
      setError('');
      console.log('AuthContext debug - Google login attempt');
      await loginWithGoogle();
      console.log('AuthContext debug - Google login success');
    } catch (err) {
      console.error('AuthContext debug - Google login error:', err.message);
      setError('Failed to login with Google: ' + err.message);
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
    console.log('AuthContext debug - Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthContext debug - Auth state changed:', user ? 'User authenticated' : 'No user');
      if (user) {
        console.log('AuthContext debug - User info:', {
          email: user.email,
          uid: user.uid,
          emailVerified: user.emailVerified
        });
      }
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
    loginWithGoogle: loginWithGoogleProvider,
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