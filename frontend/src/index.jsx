import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Ensure this file exists for your styles
import { AuthProvider } from './Context/AuthContext'; // Import the AuthProvider
import { CartProvider } from './Context/CartContext'; // Import the CartProvider

// Render the root of your application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
