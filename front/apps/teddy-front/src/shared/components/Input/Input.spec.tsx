import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('deve renderizar input', () => {
    render(<Input placeholder="Digite algo" />);
    expect(screen.getByPlaceholderText('Digite algo')).toBeInTheDocument();
  });

  it('deve renderizar label quando fornecido', () => {
    render(<Input label="Nome" />);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro quando fornecida', () => {
    render(<Input error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('deve aplicar classe de erro quando error existe', () => {
    const { container } = render(<Input error="Erro" />);
    expect(container.querySelector('.input-error')).toBeInTheDocument();
  });

  it('deve permitir digitação', async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Teste');
    
    expect(input).toHaveValue('Teste');
  });

  it('deve aceitar ref', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    
    expect(ref.current).not.toBeNull();
  });

  it('deve renderizar com type correto', () => {
    const { container } = render(<Input type="password" />);
    const input = container.querySelector('input[type="password"]');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('deve aplicar className customizada', () => {
    const { container } = render(<Input className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
