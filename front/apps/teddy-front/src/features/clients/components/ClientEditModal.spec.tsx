import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ClientEditModal } from './ClientEditModal';
import { Client } from '../../../shared/lib/selectedClients.store';

describe('ClientEditModal', () => {
  const mockClient: Client = {
    id: 1,
    name: 'João Silva',
    salary: 5000,
    companyValuation: 100000,
  };

  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar modal com dados do cliente', () => {
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Editar cliente:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100000')).toBeInTheDocument();
  });

  it('deve chamar onClose ao fechar modal pelo X', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByLabelText('Fechar modal');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('deve submeter formulário com dados atualizados', async () => {
    const user = userEvent.setup();
    mockOnSave.mockResolvedValue(undefined);
    
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const nameInput = screen.getByPlaceholderText('Nome');
    const salaryInput = screen.getByPlaceholderText('Salário');
    
    await user.clear(nameInput);
    await user.type(nameInput, 'Maria Santos');
    
    await user.clear(salaryInput);
    await user.type(salaryInput, '6000');

    const saveButton = screen.getByRole('button', { name: /editar cliente/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Maria Santos',
        salary: 6000,
        companyValuation: 100000,
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('deve validar nome obrigatório', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const nameInput = screen.getByPlaceholderText('Nome');
    await user.clear(nameInput);

    const saveButton = screen.getByRole('button', { name: /editar cliente/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('deve validar salário maior que zero', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const salaryInput = screen.getByPlaceholderText('Salário');
    await user.clear(salaryInput);
    await user.type(salaryInput, '0');

    const saveButton = screen.getByRole('button', { name: /editar cliente/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Salário deve ser maior que 0')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('deve validar valor da empresa maior que zero', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const companyInput = screen.getByPlaceholderText('Valor da empresa');
    await user.clear(companyInput);
    await user.type(companyInput, '0');

    const saveButton = screen.getByRole('button', { name: /editar cliente/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Valor da empresa deve ser maior que 0')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('deve desabilitar botão durante submissão', async () => {
    const user = userEvent.setup();
    let resolvePromise: () => void;
    const savePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockOnSave.mockReturnValue(savePromise);
    
    render(
      <ClientEditModal
        client={mockClient}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /editar cliente/i });
    await user.click(saveButton);

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /editando/i });
      expect(button).toBeDisabled();
    });
    
    resolvePromise();
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
