import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../ui/Loader';

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <Loader size="lg" text="Authenticating SecOps session token..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const userRole = (user?.role || '').toLowerCase();
    const hasRole = requiredRoles.some(
      (r) => r.toLowerCase() === userRole || userRole.includes('admin') || userRole.includes('lead')
    );

    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
