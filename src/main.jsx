import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug logging
console.log('Application starting...');
console.log('Running in mode:', import.meta.env.MODE);
console.log('Host:', window.location.host);

// Force refresh cached scripts
if (window.location.hostname !== 'localhost') {
  console.log('Forcing cache refresh for production deployment');
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
    });
  }).catch(err => console.error('Cache clearing error:', err));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
