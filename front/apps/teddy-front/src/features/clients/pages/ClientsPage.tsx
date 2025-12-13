import { useState, useEffect, useCallback } from 'react';
import { ClientCard } from '../components/ClientCard';
import { Pagination } from '../components/Pagination';
import clientsService from '../services/clients.service';
import { Client, useSelectedClientsStore } from '../../../shared/lib/selectedClients.store';
import { ClientCreateModal } from '../components/ClientCreateModal';
import { ClientEditModal } from '../components/ClientEditModal';
import { ClientDeleteModal } from '../components/ClientDeleteModal';
import './ClientsPage.css';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const { addClient, isClientSelected } = useSelectedClientsStore();

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientsService.getClients(currentPage, pageSize);
      setClients(data.clients);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleCreateClient = async (client: Omit<Client, 'id'>) => {
    await clientsService.createClient(client);
    setShowCreateModal(false);
    loadClients();
  };

  const handleEditClient = async (client: Omit<Client, 'id'>) => {
    if (editingClient) {
      await clientsService.updateClient(editingClient.id, client);
      setEditingClient(null);
      loadClients();
    }
  };

  const handleDeleteClient = async () => {
    if (deletingClient) {
      await clientsService.deleteClient(deletingClient.id);
      setDeletingClient(null);
      loadClients();
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="clients-page">
      <div className="clients-header">
        <div className="clients-info">
          <h1 className="clients-count">{total} clientes encontrados:</h1>
          <div className="page-size-selector">
            <label htmlFor="pageSize">Clientes por página:</label>
            <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <>
          <div className="clients-grid">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={setEditingClient}
                onDelete={setDeletingClient}
                onAdd={addClient}
                isSelected={isClientSelected(client.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          <div className="create-client-section">
            <button onClick={() => setShowCreateModal(true)} className="btn-create-client">
              Criar cliente
            </button>
          </div>
        </>
      )}

      {showCreateModal && (
        <ClientCreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateClient}
        />
      )}

      {editingClient && (
        <ClientEditModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSave={handleEditClient}
        />
      )}

      {deletingClient && (
        <ClientDeleteModal
          client={deletingClient}
          onClose={() => setDeletingClient(null)}
          onConfirm={handleDeleteClient}
        />
      )}
    </div>
  );
}
