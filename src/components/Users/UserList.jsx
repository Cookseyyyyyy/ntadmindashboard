import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../services/api';
import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getUsers();
      // Handle different response formats
      const usersData = response.data?.users || response.data || response || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setSuccessMessage(`User ${userToDelete.email} has been deleted.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setShowConfirmDelete(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setUserToDelete(null);
  };

  const handleUserFormSubmit = () => {
    setShowAddForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleUserFormCancel = () => {
    setShowAddForm(false);
    setEditingUser(null);
  };

  // Show loading state
  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>User Management</h2>
        <button 
          className="add-user-button"
          onClick={() => setShowAddForm(true)}
        >
          Add New User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* User Form Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserForm 
              user={editingUser} 
              onSubmit={handleUserFormSubmit}
              onCancel={handleUserFormCancel}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirmation">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete user: <strong>{userToDelete.email}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="button-group">
              <button 
                className="cancel-button"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.displayName || '-'}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <span className={`subscription-tier ${user.subscriptionTier || 'free'}`}>
                    {user.subscriptionTier ? 
                      user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1) : 
                      'Free'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-users">No users found. Add a new user to get started.</div>
      )}
    </div>
  );
};

export default UserList; 