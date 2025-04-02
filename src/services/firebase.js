// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Fallback Firebase config for production if env variables aren't loaded
const fallbackConfig = {
  apiKey: "AIzaSyBlWkV82IsnmYSfCJGArvql1410CG5L5W8",
  authDomain: "nice-touch.firebaseapp.com",
  projectId: "nice-touch",
  storageBucket: "nice-touch.firebasestorage.app",
  messagingSenderId: "902798100629",
  appId: "1:902798100629:web:5ed5eb1e576775a874b39c",
  measurementId: "G-YPJJ61TBW3"
};

// Your web app's Firebase configuration from env or fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId
};

console.log('Firebase config:', { ...firebaseConfig, apiKey: firebaseConfig.apiKey ? "PRESENT" : "MISSING" });

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