import { describe, it, expect, beforeEach } from 'vitest';
import authService from './features/auth/services/auth.service';
import { useAuthStore } from './shared/lib/auth.store';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('deve salvar token ao fazer login', async () => {
    const name = 'João Silva';
    const token = await authService.login(name);

    expect(token).toBeDefined();
    expect(useAuthStore.getState().token).toBe(token);
    expect(useAuthStore.getState().userName).toBe(name);
  });

  it('deve verificar se está autenticado', () => {
    expect(authService.isAuthenticated()).toBe(false);

    useAuthStore.getState().login('Test User', 'test-token');
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('deve limpar dados ao fazer logout', () => {
    useAuthStore.getState().login('João', 'test-token');

    authService.logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().userName).toBeNull();
  });
});
