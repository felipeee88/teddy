import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedClientsStore } from './shared/lib/selectedClients.store';

describe('selectedClients.store', () => {
  beforeEach(() => {
    localStorage.clear();
    useSelectedClientsStore.setState({ selectedClients: [] });
  });

  it('deve adicionar cliente', () => {
    const client = { id: 1, name: 'João', salary: 5000, companyValuation: 100000 };

    useSelectedClientsStore.getState().addClient(client);
    const state = useSelectedClientsStore.getState();

    expect(state.selectedClients).toHaveLength(1);
    expect(state.selectedClients[0]).toEqual(client);
  });

  it('não deve adicionar cliente duplicado', () => {
    const client = { id: 1, name: 'João', salary: 5000, companyValuation: 100000 };

    useSelectedClientsStore.getState().addClient(client);
    useSelectedClientsStore.getState().addClient(client);
    const state = useSelectedClientsStore.getState();

    expect(state.selectedClients).toHaveLength(1);
  });

  it('deve remover cliente', () => {
    const client = { id: 1, name: 'João', salary: 5000, companyValuation: 100000 };

    useSelectedClientsStore.getState().addClient(client);
    useSelectedClientsStore.getState().removeClient(client.id);
    const state = useSelectedClientsStore.getState();

    expect(state.selectedClients).toHaveLength(0);
  });

  it('deve limpar todos os clientes', () => {
    const client1 = { id: 1, name: 'João', salary: 5000, companyValuation: 100000 };
    const client2 = { id: 2, name: 'Maria', salary: 6000, companyValuation: 150000 };

    useSelectedClientsStore.getState().addClient(client1);
    useSelectedClientsStore.getState().addClient(client2);
    useSelectedClientsStore.getState().clearClients();
    const state = useSelectedClientsStore.getState();

    expect(state.selectedClients).toHaveLength(0);
  });

  it('deve verificar se cliente está selecionado', () => {
    const client = { id: 1, name: 'João', salary: 5000, companyValuation: 100000 };

    expect(useSelectedClientsStore.getState().isClientSelected(client.id)).toBe(false);

    useSelectedClientsStore.getState().addClient(client);

    expect(useSelectedClientsStore.getState().isClientSelected(client.id)).toBe(true);
  });
});
