import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../core/contexts/AuthContext';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    // Al no estar autenticado, devolvemos al inicio
    return <Navigate to="/" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    // Si no tiene el rol, redirigir al inicio
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
