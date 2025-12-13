import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar com texto', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Clique</Button>);
    await user.click(screen.getByText('Clique'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não deve chamar onClick quando disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} disabled>Clique</Button>);
    await user.click(screen.getByText('Clique'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('deve mostrar texto de loading', () => {
    render(<Button loading>Salvar</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('não deve chamar onClick quando loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} loading>Clique</Button>);
    await user.click(screen.getByText('Carregando...'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('deve aplicar classe de variante primary', () => {
    const { container } = render(<Button variant="primary">Botão</Button>);
    expect(container.querySelector('.btn-primary')).toBeInTheDocument();
  });

  it('deve aplicar classe de variante secondary', () => {
    const { container } = render(<Button variant="secondary">Botão</Button>);
    expect(container.querySelector('.btn-secondary')).toBeInTheDocument();
  });

  it('deve aplicar classe de variante danger', () => {
    const { container } = render(<Button variant="danger">Botão</Button>);
    expect(container.querySelector('.btn-danger')).toBeInTheDocument();
  });

  it('deve aplicar classe de variante ghost', () => {
    const { container } = render(<Button variant="ghost">Botão</Button>);
    expect(container.querySelector('.btn-ghost')).toBeInTheDocument();
  });
});
