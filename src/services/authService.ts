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

  /**
   * Sends an OTP to the user's registered email address
   */
  async sendForgotPasswordOtp(email: string): Promise<any> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Resets the user's password using the received OTP code
   */
  async resetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<any> {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },
};
