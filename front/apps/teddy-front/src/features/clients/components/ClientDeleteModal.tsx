import { Client } from '../../../shared/lib/selectedClients.store';
import { Modal } from '../../../shared/components/Modal';
import './ClientModals.css';

interface ClientDeleteModalProps {
  client: Client;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ClientDeleteModal({ client, onClose, onConfirm }: ClientDeleteModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Excluir cliente">
      <div className="delete-modal-content">
        <p>Você está prestes a excluir o cliente:</p>
        <p className="client-name-highlight">{client.name}</p>
        <p>Esta ação não pode ser desfeita.</p>
        <div className="form-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="btn-danger">
            Excluir cliente
          </button>
        </div>
      </div>
    </Modal>
  );
}
