import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login debug - Component mounted, user status:', currentUser ? 'Already logged in' : 'Not logged in');
    
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      console.log('Login debug - Auto-navigating to dashboard (already logged in)');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    console.log('Login debug - Attempting login with email:', email);
    
    try {
      setIsLoading(true);
      setLoginError('');
      await login(email, password);
      console.log('Login debug - Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login debug - Login failed:', error.message, error.code);
      setLoginError(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setLoginError('');
      console.log('Login debug - Attempting Google login');
      await loginWithGoogle();
      console.log('Login debug - Google login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login debug - Google login failed:', error.message, error.code);
      setLoginError(error.message || 'Failed to login with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Admin Dashboard Login</h2>
        
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login; 