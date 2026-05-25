import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/src/types.ts';
import { authService } from '@/src/services/authService.ts';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  registerUser: (userData: any) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(() => {
    const savedUser = localStorage.getItem('nway_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (_) {
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, password: string, role: UserRole = UserRole.USER) => {
    const backendData = await authService.login(email, password);

    // Map backend response fields to the User interface
    const mappedRole = backendData.role as UserRole;
    const loggedInUser: User = {
      id: backendData.id || String(Math.floor(Math.random() * 10000)),
      userId: backendData.email || email,
      name: `${backendData.firstName || ''} ${backendData.lastName || ''}`.trim() || backendData.email?.split('@')[0] || 'User',
      email: backendData.email || email,
      role: mappedRole,
      modulePermissions: backendData.modulePermissions || [],
      sectionPermissions: backendData.sectionPermissions || [],
      status: 'ACTIVE',
    };

    setUser(loggedInUser);
    localStorage.setItem('nway_user', JSON.stringify(loggedInUser));
    localStorage.setItem('nway_token', backendData.token);
  };

  const registerUser = async (userData: any) => {
    return authService.registerUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nway_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
