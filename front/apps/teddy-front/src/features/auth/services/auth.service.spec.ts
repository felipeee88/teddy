import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from './auth.service';
import apiClient from '../../../shared/lib/apiClient';
import { useAuthStore } from '../../../shared/lib/auth.store';

vi.mock('../../../shared/lib/apiClient', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ token: null, userName: null });
  });

  it('deve fazer login com sucesso quando API responde', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { 
        token: 'api-token-123',
        userName: 'João Silva',
        expiresIn: 3600
      },
    });

    await authService.login('João Silva');

    expect(apiClient.post).toHaveBeenCalledWith('/api/v1/auth/token', { name: 'João Silva' });
    expect(useAuthStore.getState().token).toBe('api-token-123');
    expect(useAuthStore.getState().userName).toBe('João Silva');
  });

  it('deve fazer logout e limpar estado', () => {
    useAuthStore.getState().login('User', 'token-123');
    
    authService.logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().userName).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('deve retornar token do estado', () => {
    useAuthStore.getState().login('User', 'my-token');

    expect(authService.getToken()).toBe('my-token');
  });

  it('deve retornar null quando não há token', () => {
    expect(authService.getToken()).toBeNull();
  });

  it('deve retornar nome do usuário do estado', () => {
    useAuthStore.getState().login('João Silva', 'token');

    expect(authService.getUserName()).toBe('João Silva');
  });

  it('deve retornar null quando não há usuário', () => {
    expect(authService.getUserName()).toBeNull();
  });

  it('deve verificar se está autenticado', () => {
    expect(authService.isAuthenticated()).toBe(false);

    useAuthStore.getState().login('User', 'token');
    expect(authService.isAuthenticated()).toBe(true);

    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
  });
});
  });
});
