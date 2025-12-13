import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

const noop = () => { /* empty */ };

describe('Modal', () => {
  it('deve renderizar quando isOpen é true', () => {
    render(
      <Modal isOpen={true} onClose={noop} title="Teste Modal">
        <p>Conteúdo do modal</p>
      </Modal>
    );
    
    expect(screen.getByText('Teste Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('não deve renderizar quando isOpen é false', () => {
    render(
      <Modal isOpen={false} onClose={noop} title="Teste Modal">
        <p>Conteúdo do modal</p>
      </Modal>
    );
    
    expect(screen.queryByText('Teste Modal')).not.toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar no botão X', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>
    );
    
    await user.click(screen.getByLabelText('Fechar modal'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no overlay', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>
    );
    
    const overlay = container.querySelector('.modal-overlay');
    if (overlay) {
      await user.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('não deve chamar onClose ao clicar no conteúdo do modal', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>
    );
    
    await user.click(screen.getByText('Conteúdo'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('deve fechar ao pressionar ESC', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Teste">
        <p>Conteúdo</p>
      </Modal>
    );
    
    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deve ter atributos de acessibilidade', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={noop} title="Teste">
        <p>Conteúdo</p>
      </Modal>
    );
    
    const overlay = container.querySelector('[role="dialog"]');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-modal', 'true');
  });
});
