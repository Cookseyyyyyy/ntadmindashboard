// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Log Firebase config keys present (not values)
console.log('Firebase debug - Config keys present:', 
  Object.keys(firebaseConfig).reduce((acc, key) => {
    acc[key] = firebaseConfig[key] ? '✅' : '❌';
    return acc;
  }, {})
);

// Debug: Log environment
console.log('Firebase debug - Environment:', {
  mode: import.meta.env.MODE,
  host: window.location.hostname,
  isProd: import.meta.env.PROD
});

// Initialize Firebase
let app;
let auth;
const googleProvider = new GoogleAuthProvider();

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase debug - Initialization successful');
} catch (error) {
  console.error('Firebase debug - Initialization error:', error.message);
  console.error('Error code:', error.code);
  console.error('Error details:', error);
}

// Auth functions
export const loginWithEmailAndPassword = (email, password) => {
  console.log('Firebase debug - Attempting login for:', email);
  return signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      console.log('Firebase debug - Login successful');
      return result;
    })
    .catch(error => {
      console.error('Firebase debug - Login error:', error.message, error.code);
      throw error;
    });
};

export const loginWithGoogle = () => {
  console.log('Firebase debug - Attempting Google login');
  return signInWithPopup(auth, googleProvider)
    .then(result => {
      console.log('Firebase debug - Google login successful');
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      return result;
    })
    .catch(error => {
      console.error('Firebase debug - Google login error:', error.message, error.code);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      throw error;
    });
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, onAuthStateChanged }; 