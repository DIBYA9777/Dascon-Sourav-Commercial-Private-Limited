import apiClient from './apiClient';

export interface LoginResponse {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  token: string;
  modulePermissions?: string[];
  sectionPermissions?: string[];
}

export const authService = {
  /**
   * Log in user using credentials
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register a new user (admin/superadmin action)
   */
  async registerUser(userData: any): Promise<any> {
    const response = await apiClient.post('/admin/register-user', {
      ...userData,
      modulePermissions: userData.modulePermissions || [],
      sectionPermissions: userData.sectionPermissions || [],
    });
    return response.data;
  },
};
