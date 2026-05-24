import { UserRole } from '@/src/types.ts';

/**
 * Represent a standard payload required for backend auth login
 */
export interface LoginRequest {
  email: string;
  password?: string;
}

/**
 * Represents the industry-scale backend response for a successful login
 */
export interface SecureLoginResponse {
  token: string;
  refreshToken: string | null;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  modulePermissions: string[];
  sectionPermissions: string[];
  message?: string;
}

/**
 * Offline credentials configuration for fallback resilience
 */
export interface LocalSystemUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  password?: string;
  role: UserRole;
  modulePermissions?: string[];
  sectionPermissions?: string[];
}
