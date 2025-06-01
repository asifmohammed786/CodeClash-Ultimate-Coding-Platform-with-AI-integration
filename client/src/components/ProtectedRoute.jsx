// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(AppContext);
  if (!userData) {
    // Not logged in, redirect to login/signup
    return <Navigate to="/login" replace />;
  }
  // Logged in, show the protected page
  return children;
};

export default ProtectedRoute;
