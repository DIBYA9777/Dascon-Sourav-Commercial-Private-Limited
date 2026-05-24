import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { UserRole } from '@/src/types.ts';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export const SuperAdminRoute: React.FC = () => <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN]} />;
export const AdminRoute: React.FC = () => <RoleRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]} />;
export const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
