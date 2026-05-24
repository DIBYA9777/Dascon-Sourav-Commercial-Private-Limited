import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/src/types.ts';
import { AUTH_ENDPOINTS } from '@/src/constants/apiConfig.ts';

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
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      let errorMsg = 'Authentication Failed';
      try {
        const errData = await response.json();
        errorMsg = errData.message || errData.error || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const backendData = await response.json();
    if (!backendData || !backendData.token) {
      throw new Error('Invalid backend login response structure');
    }

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
    const token = localStorage.getItem('nway_token');
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ...userData,
        modulePermissions: userData.modulePermissions || [],
        sectionPermissions: userData.sectionPermissions || [],
      }),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to register user';
      try {
        const errData = await response.json();
        errorMsg = errData.message || errData.error || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const resData = await response.json();
    return resData;
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
