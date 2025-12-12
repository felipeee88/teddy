import { Client } from '../../../shared/lib/selectedClients.store';
import { formatCurrencyBRL } from '../../../shared/lib/format';
import './SelectedClientCard.css';

interface SelectedClientCardProps {
  client: Client;
  onRemove: (client: Client) => void;
}

export function SelectedClientCard({ client, onRemove }: SelectedClientCardProps) {
  return (
    <div className="selected-client-card">
      <div className="client-info">
        <h3>{client.name}</h3>
        <p>
          <strong>Salário:</strong> {formatCurrencyBRL(client.salary)}
        </p>
        <p>
          <strong>Empresa:</strong> {formatCurrencyBRL(client.companyValuation)}
        </p>
      </div>
      <div className="client-actions">
        <button
          onClick={() => onRemove(client)}
          className="btn-icon btn-remove"
          title="Remover"
        >
          -
        </button>
      </div>
    </div>
  );
}
