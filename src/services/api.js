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
    createdAt: '2023-01-01T00:00:00Z',
    stripeCustomerId: 'cus_mock1',
    subscriptionTier: 'team'
  },
  {
    id: '2',
    email: 'user@example.com',
    displayName: 'Regular User',
    role: 'user',
    isActive: true, 
    createdAt: '2023-01-02T00:00:00Z',
    stripeCustomerId: 'cus_mock2',
    subscriptionTier: 'personal'
  }
];

// Mock subscription data
const MOCK_SUBSCRIPTIONS = {
  '1': {
    subscription: {
      id: 'sub_mock1',
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    hasSubscription: true,
    subscriptionTier: 'team'
  },
  '2': {
    subscription: {
      id: 'sub_mock2',
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    hasSubscription: true,
    subscriptionTier: 'personal'
  }
};

// Settings from environment variables
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
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
    const response = await api.get('/users');
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
      createdAt: new Date().toISOString(),
      stripeCustomerId: null,
      subscriptionTier: 'free'
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

    const response = await api.post('/users/create', userData);
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

// Subscription API functions
export const getUserSubscription = async (userId) => {
  if (USE_MOCK) {
    const mockSubscription = MOCK_SUBSCRIPTIONS[userId];
    if (mockSubscription) {
      return { data: mockSubscription };
    }
    // Return a default free tier if no mock subscription exists
    return { 
      data: {
        subscription: null,
        hasSubscription: false,
        subscriptionTier: 'free'
      }
    };
  }
  
  try {
    const response = await api.get(`/billing/subscription/${userId}`);
    if (response.data.status === 'success') {
      return { data: response.data.data };
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching subscription for user ${userId}:`, error);
    throw error;
  }
};

export default api; 