import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SelectedClientsPage } from './SelectedClientsPage';
import { useSelectedClientsStore } from '../../../shared/lib/selectedClients.store';

const mockClients = [
  { id: '1', name: 'João Silva', salary: 5000, companyValue: 100000, accessCount: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: 'Maria Santos', salary: 6500, companyValue: 150000, accessCount: 0, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

describe('SelectedClientsPage', () => {
  beforeEach(() => {
    useSelectedClientsStore.setState({ selectedClients: [] });
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('deve mostrar mensagem quando não há clientes selecionados', () => {
    renderWithRouter(<SelectedClientsPage />);

    expect(screen.getByText('Nenhum cliente selecionado')).toBeInTheDocument();
  });

  it('deve renderizar lista de clientes selecionados', () => {
    useSelectedClientsStore.setState({ selectedClients: mockClients });

    renderWithRouter(<SelectedClientsPage />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('deve exibir título correto', () => {
    renderWithRouter(<SelectedClientsPage />);

    expect(screen.getByText('Clientes selecionados:')).toBeInTheDocument();
  });

  it('deve remover cliente ao clicar no botão -', async () => {
    const user = userEvent.setup();
    useSelectedClientsStore.setState({ selectedClients: mockClients });

    renderWithRouter(<SelectedClientsPage />);

    const removeButtons = screen.getAllByTitle('Remover');
    await user.click(removeButtons[0]);

    const state = useSelectedClientsStore.getState();
    expect(state.selectedClients).toHaveLength(1);
    expect(state.selectedClients[0].id).toBe(2);
  });

  it('deve limpar todos os clientes ao clicar em Limpar', async () => {
    const user = userEvent.setup();
    useSelectedClientsStore.setState({ selectedClients: mockClients });

    renderWithRouter(<SelectedClientsPage />);

    await user.click(screen.getByText('Limpar clientes selecionados'));

    const state = useSelectedClientsStore.getState();
    expect(state.selectedClients).toHaveLength(0);
  });

  it('não deve mostrar botão limpar quando lista está vazia', () => {
    renderWithRouter(<SelectedClientsPage />);

    expect(screen.queryByText('Limpar clientes selecionados')).not.toBeInTheDocument();
  });

  it('deve mostrar botão limpar quando há clientes', () => {
    useSelectedClientsStore.setState({ selectedClients: mockClients });

    renderWithRouter(<SelectedClientsPage />);

    expect(screen.getByText('Limpar clientes selecionados')).toBeInTheDocument();
  });

  it('deve formatar valores monetários corretamente', () => {
    useSelectedClientsStore.setState({ selectedClients: [mockClients[0]] });

    renderWithRouter(<SelectedClientsPage />);

    expect(screen.getByText(/R\$\s*5\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*100\.000,00/)).toBeInTheDocument();
  });
});
