import React from 'react';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { UserRole } from '@/src/types.ts';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
