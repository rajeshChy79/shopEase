import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Layout from './Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated()) {
    // Pass the current location so login can redirect back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

// Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);