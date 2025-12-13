import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ClientCard } from './ClientCard';
import { Client } from '../../../shared/types/client';

describe('ClientCard', () => {
  const mockClient: Client = {
    id: '1',
    name: 'João Silva',
    salary: 5000,
    companyValue: 100000,
    accessCount: 0,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAdd = vi.fn();
  const mockOnRemove = vi.fn();

  it('deve renderizar informações do cliente', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 5\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 100\.000,00/)).toBeInTheDocument();
  });

  it('deve chamar onEdit quando clicar no botão de editar', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle('Editar');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockClient);
  });

  it('deve chamar onDelete quando clicar no botão de excluir', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Excluir');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockClient);
  });

  it('deve mostrar botão de adicionar quando onAdd está presente e não está selecionado', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
        isSelected={false}
      />
    );

    const addButton = screen.getByTitle('Adicionar aos selecionados');
    expect(addButton).toBeInTheDocument();
    
    await user.click(addButton);
    expect(mockOnAdd).toHaveBeenCalledWith(mockClient);
  });

  it('deve mostrar botão de remover quando onRemove está presente e está selecionado', async () => {
    const user = userEvent.setup();
    
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRemove={mockOnRemove}
        isSelected={true}
      />
    );

    const removeButton = screen.getByTitle('Remover dos selecionados');
    expect(removeButton).toBeInTheDocument();
    
    await user.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledWith(mockClient);
  });

  it('não deve mostrar botão de adicionar quando está selecionado', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
        isSelected={true}
      />
    );

    expect(screen.queryByTitle('Adicionar aos selecionados')).not.toBeInTheDocument();
  });

  it('não deve mostrar botão de remover quando não está selecionado', () => {
    render(
      <ClientCard
        client={mockClient}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRemove={mockOnRemove}
        isSelected={false}
      />
    );

    expect(screen.queryByTitle('Remover dos selecionados')).not.toBeInTheDocument();
  });
});
