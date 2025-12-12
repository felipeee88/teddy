import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

const noop = () => { /* empty */ };

describe('Pagination', () => {
  it('deve renderizar páginas corretamente', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={noop}
      />
    );
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('deve destacar página atual', () => {
    const { container } = render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={noop}
      />
    );
    
    const activeButton = container.querySelector('.active');
    expect(activeButton).toHaveTextContent('3');
  });

  it('deve chamar onPageChange com número correto ao clicar', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );
    
    await user.click(screen.getByText('3'));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('deve desabilitar botão anterior na primeira página', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={noop}
      />
    );
    
    const prevButton = container.querySelector('button:first-child');
    expect(prevButton).toBeDisabled();
  });

  it('deve desabilitar botão próximo na última página', () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={noop}
      />
    );
    
    const nextButton = container.querySelector('button:last-child');
    expect(nextButton).toBeDisabled();
  });

  it('deve chamar onPageChange para página anterior', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );
    
    await user.click(screen.getByText('‹'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('deve chamar onPageChange para próxima página', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );
    
    await user.click(screen.getByText('›'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('deve mostrar elipses quando há muitas páginas', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={12}
        onPageChange={noop}
      />
    );
    
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });
});
