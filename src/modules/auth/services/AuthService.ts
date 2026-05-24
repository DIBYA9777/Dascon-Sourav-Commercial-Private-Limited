import { User, UserRole } from '@/src/types.ts';
import { LoginRequest, SecureLoginResponse } from '../models/AuthTypes.ts';
import { AUTH_ENDPOINTS } from '@/src/constants/apiConfig.ts';

export class AuthService {
  /**
   * Performs real API authentication request to remote server
   */
  public static async authenticateRemote(payload: LoginRequest): Promise<SecureLoginResponse> {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Authentication protocol failed';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      } catch (_) {
        // Failed to parse, use default
      }
      throw new Error(errorMessage);
    }

    const data: SecureLoginResponse = await response.json();
    if (!data || !data.token) {
      throw new Error('Malformed or empty token response structure from remote gateway');
    }

    return data;
  }

  /**
   * Persists authentication details to LocalStore variables
   */
  public static saveSession(user: User, token: string): void {
    localStorage.setItem('nway_user', JSON.stringify(user));
    localStorage.setItem('nway_token', token);
  }

  /**
   * Removes cached variables for safety and security
   */
  public static destroySession(): void {
    localStorage.removeItem('nway_user');
    localStorage.removeItem('nway_token');
  }
}
