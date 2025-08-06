// src/Components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRoles } from '../utils/auth.jsx';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  const roles = getUserRoles();
  const hasPermission =
    allowedRoles.length === 0 || roles.some((r) => allowedRoles.includes(r));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
