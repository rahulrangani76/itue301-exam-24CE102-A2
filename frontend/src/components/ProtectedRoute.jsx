import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ roles }) {
  const { customer, token } = useAuth();
  const location = useLocation();
  if (!customer || !token) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(customer.role)) return <Navigate to="/fleet" replace />;
  return <Outlet />;
}
