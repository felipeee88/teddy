import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';

describe('apiClient', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, userName: null });
  });

  it('deve ter token disponível no store quando usuário está autenticado', () => {
    const token = 'test-token-123';
    useAuthStore.getState().login('Test User', token);
    
    expect(useAuthStore.getState().token).toBe(token);
  });

  it('não deve ter token quando usuário não está autenticado', () => {
    useAuthStore.getState().logout();
    
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('deve manter token após login', () => {
    useAuthStore.getState().login('User', 'my-token');
    
    const token = useAuthStore.getState().token;
    expect(token).toBe('my-token');
  });
});
