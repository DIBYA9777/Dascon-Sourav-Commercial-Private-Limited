import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext.tsx';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
