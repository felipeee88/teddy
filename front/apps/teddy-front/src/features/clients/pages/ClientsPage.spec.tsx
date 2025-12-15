import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ClientsPage } from './ClientsPage';
import clientsService from '../services/clients.service';

const noop = () => { /* empty */ };

vi.mock('../services/clients.service');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockClients = [
  { id: '1', name: 'João Silva', salary: 5000, companyValue: 100000, accessCount: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Maria Santos', salary: 6500, companyValue: 150000, accessCount: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: 'Pedro Oliveira', salary: 4500, companyValue: 90000, accessCount: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

describe('ClientsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(clientsService.getClients).mockResolvedValue({
      items: mockClients,
      totalItems: 3,
      page: 1,
      pageSize: 16,
      totalPages: 1,
    });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('deve carregar clientes ao renderizar', async () => {
    renderWithRouter(<ClientsPage />);

    await waitFor(() => {
      expect(clientsService.getClients).toHaveBeenCalled();
    });
  });

  it('deve exibir total de clientes encontrados', async () => {
    renderWithRouter(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText('3 clientes encontrados:')).toBeInTheDocument();
    });
  });

  it('deve exibir lista de clientes', async () => {
    renderWithRouter(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
    });
  });

  it('deve abrir modal ao clicar em Criar cliente', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText('Criar cliente')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Criar cliente'));

    await waitFor(() => {
      expect(screen.getByText('Criar cliente:')).toBeInTheDocument();
    });
  });

  it('deve mostrar loading durante carregamento', () => {
    vi.mocked(clientsService.getClients).mockImplementation(
      () => new Promise(noop) // Never resolves
    );

    renderWithRouter(<ClientsPage />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve chamar getClients com pageSize correto', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ClientsPage />);

    await waitFor(() => {
      expect(clientsService.getClients).toHaveBeenCalledWith(1, 16);
    });

    // Change pageSize
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '8');

    await waitFor(() => {
      expect(clientsService.getClients).toHaveBeenCalledWith(1, 8);
    });
  });

  it('deve recarregar ao mudar de página', async () => {
    const user = userEvent.setup();
    
    vi.mocked(clientsService.getClients).mockResolvedValue({
      items: mockClients,
      totalItems: 50,
      page: 1,
      pageSize: 16,
      totalPages: 4,
    });

    renderWithRouter(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    // Click next page
    const nextButton = screen.getByText('›');
    await user.click(nextButton);

    await waitFor(() => {
      expect(clientsService.getClients).toHaveBeenCalledWith(2, 16);
    });
  });
});
