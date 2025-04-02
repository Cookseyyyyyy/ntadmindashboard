import { useState, useEffect } from 'react';
import { createUser, updateUser } from '../../services/api';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    role: 'user',
    isActive: true,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If user is provided, we're in edit mode
  const isEditMode = !!user;

  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        displayName: user.displayName || '',
        role: user.role || 'user',
        isActive: user.isActive ?? true,
        password: ''
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const userData = {...formData};
      
      if (isEditMode) {
        // Remove empty password field when submitting
        if (!userData.password) {
          delete userData.password;
        }
        await updateUser(user.id, userData);
      } else {
        // For new users, create Firebase auth user first
        const auth = getAuth();
        try {
          // Create Firebase user
          const firebaseUserCredential = await createUserWithEmailAndPassword(
            auth, 
            userData.email, 
            userData.password
          );
          
          // Add firebaseUid to user data
          userData.firebaseUid = firebaseUserCredential.user.uid;
          
          // Remove password as it's already stored in Firebase Auth
          delete userData.password;
          
          // Create user in your API
          await createUser(userData);
        } catch (firebaseError) {
          console.error("Firebase user creation error:", firebaseError);
          setError(`Failed to create user: ${firebaseError.message}`);
          setLoading(false);
          return;
        }
      }
      
      onSubmit();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form">
      <h3>{isEditMode ? 'Edit User' : 'Add New User'}</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEditMode || loading} // Email can't be changed in edit mode
          />
        </div>
        
        {!isEditMode && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group checkbox">
          <label htmlFor="isActive">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={loading}
            />
            Active
          </label>
        </div>
        
        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm; 