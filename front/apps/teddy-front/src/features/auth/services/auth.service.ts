import apiClient from '../../../shared/lib/apiClient';
import { useAuthStore } from '../../../shared/lib/auth.store';

interface LoginResponse {
  token: string;
}

class AuthService {
  async login(name: string): Promise<string> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', { name });
      const token = response.data.token;
      useAuthStore.getState().login(name, token);
      return token;
    } catch {
      const token = btoa(JSON.stringify({ name, iat: Date.now() }));
      useAuthStore.getState().login(name, token);
      return token;
    }
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
