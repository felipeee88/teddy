import { Client } from '../../../shared/types/client';
import { formatCurrencyBRL } from '../../../shared/lib/format';
import './ClientCard.css';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onAdd?: (client: Client) => void;
  onRemove?: (client: Client) => void;
  isSelected?: boolean;
}

export function ClientCard({
  client,
  onEdit,
  onDelete,
  onAdd,
  onRemove,
  isSelected = false,
}: ClientCardProps) {
  return (
    <div className="client-card">
      <div className="client-info">
        <h3>{client.name}</h3>
        <p>
          <strong>Salário:</strong> {formatCurrencyBRL(client.salary)}
        </p>
        <p>
          <strong>Empresa:</strong> {formatCurrencyBRL(client.companyValue)}
        </p>
      </div>
      <div className="client-actions">
        {onAdd && !isSelected && (
          <button
            onClick={() => onAdd(client)}
            className="btn-icon btn-add"
            title="Adicionar aos selecionados"
          >
            +
          </button>
        )}
        {onRemove && isSelected && (
          <button
            onClick={() => onRemove(client)}
            className="btn-icon btn-remove"
            title="Remover dos selecionados"
          >
            -
          </button>
        )}
        <button
          onClick={() => onEdit(client)}
          className="btn-icon btn-edit"
          title="Editar"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(client)}
          className="btn-icon btn-delete"
          title="Excluir"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
