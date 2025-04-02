# Nice Touch Admin Dashboard

A simple admin dashboard for managing users in the Nice Touch application.

## Features

- Firebase Authentication
- User Management (CRUD operations)
- Role Management
- Responsive Design

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (version 7 or higher)
- Nice Touch Backend API running
- Firebase project for authentication

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables by copying `.env` and filling in your Firebase configuration:

```bash
# API URL - adjust to match your backend API URL
VITE_API_URL=http://localhost:3000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

### Setting Up Admin User

To create the first admin user:

1. Create a user account in Firebase Authentication
2. Use the provided script to assign the admin role to this user:

```javascript
// set-admin.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create service account from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com'
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdmin() {
  // Replace with your admin email
  const email = 'admin@example.com';
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set admin role for ${email}`);
  } catch (error) {
    console.error('Error setting admin role:', error);
  }
}

setAdmin();
```

## Backend API Requirements

This dashboard expects the following API endpoints:

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get a specific user
- `POST /api/admin/users` - Create a new user
- `PUT /api/admin/users/:id` - Update a user
- `DELETE /api/admin/users/:id` - Delete a user

Each request includes a Firebase authentication token in the Authorization header.

## License

This project is private and confidential.
