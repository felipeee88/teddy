import apiClient from '../../../shared/lib/apiClient';
import { useAuthStore } from '../../../shared/lib/auth.store';
import { LoginRequest, LoginResponse } from '../../../shared/types/client';

class AuthService {
  async login(name: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', { name } as LoginRequest);
    const { token, userName, expiresIn } = response.data;
    useAuthStore.getState().login(userName, token);
    return response.data;
  }

  logout(): void {
    useAuthStore.getState().logout();
  }

  getToken(): string | null {
    return useAuthStore.getState().token;
  }

  getUserName(): string | null {
    return useAuthStore.getState().userName;
  }

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated();
  }
}

export default new AuthService();
