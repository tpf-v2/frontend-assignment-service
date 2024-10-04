import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);

  if (!token) {
    // Si no hay token, redirige a "/"
    return <Navigate to="/" />;
  }

  // Si hay token, muestra el componente hijo
  return children;
};

export default ProtectedRoute;
