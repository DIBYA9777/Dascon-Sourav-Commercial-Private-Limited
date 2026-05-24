/**
 * Central API configurations and base endpoints.
 * This is used across the application for consistent URL imports.
 */
export const API_BASE_URL = '/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/admin/register-user`,
  USERS: `${API_BASE_URL}/admin/users`,
};
