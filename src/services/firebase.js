// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Production Firebase config (hardcoded)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBlWkV82IsnmYSfCJGArvql1410CG5L5W8",
  authDomain: "nice-touch.firebaseapp.com",
  projectId: "nice-touch",
  storageBucket: "nice-touch.firebasestorage.app",
  messagingSenderId: "902798100629",
  appId: "1:902798100629:web:5ed5eb1e576775a874b39c",
  measurementId: "G-YPJJ61TBW3"
};

// Force use of hardcoded config for reliability
console.log('Initializing Firebase with hardcoded config');
console.log('Firebase config being used:', JSON.stringify({
  ...FIREBASE_CONFIG,
  apiKey: FIREBASE_CONFIG.apiKey ? "PRESENT" : "MISSING"
}));

let auth;
let app;

// Initialize Firebase with hardcoded config
try {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

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