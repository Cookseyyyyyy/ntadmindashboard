// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Production Firebase config - always use this in production
const prodConfig = {
  apiKey: "AIzaSyBlWkV82IsnmYSfCJGArvql1410CG5L5W8",
  authDomain: "nice-touch.firebaseapp.com",
  projectId: "nice-touch",
  storageBucket: "nice-touch.firebasestorage.app",
  messagingSenderId: "902798100629",
  appId: "1:902798100629:web:5ed5eb1e576775a874b39c",
  measurementId: "G-YPJJ61TBW3"
};

// Check if we're in development mode (localhost)
const isDevelopment = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1';

// Use environment variables in development, hardcoded values in production
const firebaseConfig = isDevelopment 
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    }
  : prodConfig;

console.log('Firebase config mode:', isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION');
console.log('Firebase API key present:', !!firebaseConfig.apiKey);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth functions
export const loginWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, onAuthStateChanged }; 