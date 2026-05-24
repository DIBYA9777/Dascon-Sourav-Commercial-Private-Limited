import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '@/src/types.ts';
import { useAuth } from '@/src/context/AuthContext.tsx';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
