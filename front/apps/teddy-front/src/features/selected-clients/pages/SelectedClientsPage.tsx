import { useSelectedClientsStore } from '../../../shared/lib/selectedClients.store';
import { SelectedClientCard } from '../components/SelectedClientCard';
import { Client } from '../../../shared/types/client';
import './SelectedClientsPage.css';

export function SelectedClientsPage() {
  const { selectedClients, removeClient, clearClients } = useSelectedClientsStore();

  const handleRemove = (client: Client) => {
    removeClient(client.id);
  };

  return (
    <div className="selected-clients-page">
      <h1 className="page-title">Clientes selecionados:</h1>

      {selectedClients.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum cliente selecionado</p>
          <p className="empty-subtitle">
            Adicione clientes da página de clientes clicando no botão +
          </p>
        </div>
      ) : (
        <>
          <div className="selected-clients-grid">
            {selectedClients.map((client) => (
              <SelectedClientCard key={client.id} client={client} onRemove={handleRemove} />
            ))}
          </div>
          <div className="clear-section">
            <button onClick={clearClients} className="btn-clear-all">
              Limpar clientes selecionados
            </button>
          </div>
        </>
      )}
    </div>
  );
}
