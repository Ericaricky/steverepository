import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  roles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F4C81]"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(roles as any[])) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;