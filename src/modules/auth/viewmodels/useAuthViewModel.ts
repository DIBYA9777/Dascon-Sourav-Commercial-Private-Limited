import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext.tsx';
import { UserRole } from '@/src/types.ts';

export interface AuthViewModel {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  executeLogin: (e: React.FormEvent) => Promise<void>;
}

export function useAuthViewModel(): AuthViewModel {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SUPER_ADMIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login: updateGlobalAuth } = useAuth();
  const navigate = useNavigate();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email identifier is required');
      return;
    }
    if (!password) {
      setError('Security token/password is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call direct API login via global state manager (AuthContext)
      await updateGlobalAuth(email, password, role);
      navigate('/');
    } catch (apiError: any) {
      console.error('Authentication checking failed:', apiError);
      setError(apiError.message || 'GATEWAY PROTOCOL FAIL: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    error,
    clearError,
    executeLogin,
  };
}
