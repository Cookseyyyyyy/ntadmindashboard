import axios from 'axios';
import { getCurrentUser } from './firebase';

// Mock data for development
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@example.com',
    displayName: 'Regular User',
    role: 'user',
    isActive: true, 
    createdAt: '2023-01-02T00:00:00Z'
  }
];

// Hardcoded settings for reliability
const USE_MOCK = false;
const API_URL = 'https://nicetouchapp-2ux5n.kinsta.app/api';

// Log configuration
console.log('API service initialized with:', { 
  USE_MOCK, 
  API_URL 
});

// Create an axios instance with base URL from environment variables
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable withCredentials for CORS with credentials
  withCredentials: true
});

// Add a request interceptor to inject the auth token
api.interceptors.request.use(
  async (config) => {
    const user = getCurrentUser();
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added auth token to request');
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    } else {
      console.warn('No user logged in, request will be unauthenticated');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API functions with mock data support
export const getUsers = async () => {
  if (USE_MOCK) {
    console.log('Using mock data for users');
    return { data: MOCK_USERS };
  }
  
  try {
    console.log('Fetching users from API');
    const response = await api.get('/users');
    console.log('Users API response:', response);
    if (response.data.status === 'success') {
      return { data: response.data.data };
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  if (USE_MOCK) {
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) return { data: user };
    throw new Error('User not found');
  }
  
  try {
    const response = await api.get(`/users/${id}`);
    if (response.data.status === 'success') {
      return { data: response.data.data };
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  if (USE_MOCK) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    MOCK_USERS.push(newUser);
    return { data: newUser };
  }
  
  try {
    // Make sure we have the required firebaseUid
    if (!userData.firebaseUid) {
      console.error('Missing required firebaseUid field');
      throw new Error('User creation requires a Firebase user ID');
    }

    console.log('Creating user with data:', userData);
    const response = await api.post('/users/create', userData);
    console.log('Server response:', response);
    if (response.data.status === 'success') {
      return { data: response.data.data };
    }
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  if (USE_MOCK) {
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index >= 0) {
      MOCK_USERS[index] = { ...MOCK_USERS[index], ...userData };
      return { data: MOCK_USERS[index] };
    }
    throw new Error('User not found');
  }
  
  try {
    const response = await api.put(`/users/${id}`, userData);
    if (response.data.status === 'success') {
      return { data: response.data.data };
    }
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  if (USE_MOCK) {
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index >= 0) {
      const deleted = MOCK_USERS.splice(index, 1)[0];
      return { data: deleted };
    }
    throw new Error('User not found');
  }
  
  try {
    const response = await api.delete(`/users/${id}`);
    if (response.data.status === 'success') {
      return { data: response.data.message || 'User deleted successfully' };
    }
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export default api; 