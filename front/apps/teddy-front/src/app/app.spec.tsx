import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import { LoginPage } from '../features/auth/pages/LoginPage';
import authService from '../features/auth/services/auth.service';

vi.mock('../features/auth/services/auth.service', () => ({
  default: {
    login: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o formulário de login', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Digite o seu nome:')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('deve validar nome obrigatório', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const button = screen.getByText('Entrar');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Nome deve ter no mínimo 2 caracteres/i)).toBeInTheDocument();
    });
  });

  it('deve fazer login com sucesso e navegar para /clients', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.login).mockResolvedValue('fake-token');
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Digite o seu nome:');
    const button = screen.getByText('Entrar');

    await user.type(input, 'João Silva');
    await user.click(button);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('João Silva');
      expect(mockNavigate).toHaveBeenCalledWith('/clients');
    });
  });

  it('deve desabilitar botão durante submissão', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: string) => void;
    const loginPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(authService.login).mockReturnValue(loginPromise);
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Digite o seu nome:');
    const button = screen.getByText('Entrar');

    await user.type(input, 'João Silva');
    await user.click(button);

    expect(button).toBeDisabled();
    
    resolvePromise('fake-token');
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('deve mostrar botão Entrando durante submissão', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: string) => void;
    const loginPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(authService.login).mockReturnValue(loginPromise);
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Digite o seu nome:');
    const button = screen.getByRole('button', { name: 'Entrar' });

    await user.type(input, 'João Silva');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Entrando...' })).toBeInTheDocument();
    });

    resolvePromise('fake-token');
  });
});
