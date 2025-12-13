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
      data: { token: 'api-token-123' },
    } as { data: { token: string } });

    const token = await authService.login('João Silva');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { name: 'João Silva' });
    expect(token).toBe('api-token-123');
    expect(useAuthStore.getState().token).toBe('api-token-123');
    expect(useAuthStore.getState().userName).toBe('João Silva');
  });

  it('deve fazer login com token mock quando API falha', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('API error'));

    const token = await authService.login('Maria Santos');

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', { name: 'Maria Santos' });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(useAuthStore.getState().userName).toBe('Maria Santos');
    expect(useAuthStore.getState().token).toBe(token);
  });

  it('deve gerar token mock válido quando API falha', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

    const token = await authService.login('Test User');
    
    // Token deve ser base64
    const decoded = JSON.parse(atob(token));
    expect(decoded.name).toBe('Test User');
    expect(decoded.iat).toBeDefined();
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

  it('deve lidar com erro de rede na API', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network timeout'));

    const token = await authService.login('Test User');

    // Deve gerar fallback token
    expect(token).toBeDefined();
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });

  it('deve lidar com resposta inválida da API', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Invalid response'));

    const token = await authService.login('Test User');

    // Deve usar fallback
    expect(token).toBeDefined();
    expect(useAuthStore.getState().userName).toBe('Test User');
  });
});
