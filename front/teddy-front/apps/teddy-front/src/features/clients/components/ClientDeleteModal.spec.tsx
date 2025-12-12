import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ClientDeleteModal } from './ClientDeleteModal';
import { Client } from '../../../shared/lib/selectedClients.store';

describe('ClientDeleteModal', () => {
  const mockClient: Client = {
    id: 1,
    name: 'João Silva',
    salary: 5000,
    companyValuation: 100000,
  };

  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar modal com nome do cliente', () => {
    render(
      <ClientDeleteModal
        client={mockClient}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByRole('heading', { name: 'Excluir cliente' })).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Você está prestes a excluir o cliente:')).toBeInTheDocument();
    expect(screen.getByText('Esta ação não pode ser desfeita.')).toBeInTheDocument();
  });

  it('deve chamar onClose quando clicar em Cancelar', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientDeleteModal
        client={mockClient}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('deve chamar onConfirm quando clicar em Excluir cliente', async () => {
    const user = userEvent.setup();
    mockOnConfirm.mockResolvedValue(undefined);
    
    render(
      <ClientDeleteModal
        client={mockClient}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const deleteButton = screen.getByRole('button', { name: 'Excluir cliente' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
    });
  });

  it('deve ter botões com as classes corretas', () => {
    render(
      <ClientDeleteModal
        client={mockClient}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    const deleteButton = screen.getByRole('button', { name: 'Excluir cliente' });

    expect(cancelButton).toHaveClass('btn-secondary');
    expect(deleteButton).toHaveClass('btn-danger');
  });

  it('deve renderizar nome do cliente com estilo destacado', () => {
    render(
      <ClientDeleteModal
        client={mockClient}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const clientNameElement = screen.getByText('João Silva');
    expect(clientNameElement).toHaveClass('client-name-highlight');
  });
});
