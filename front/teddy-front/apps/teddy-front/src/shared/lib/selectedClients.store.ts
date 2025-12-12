import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '../types';

interface SelectedClientsStore {
  selectedClients: Client[];
  addClient: (client: Client) => void;
  removeClient: (clientId: number) => void;
  clearClients: () => void;
  isClientSelected: (clientId: number) => boolean;
}

export const useSelectedClientsStore = create<SelectedClientsStore>()(
  persist(
    (set, get) => ({
      selectedClients: [],
      addClient: (client) =>
        set((state) => {
          if (state.selectedClients.some((c) => c.id === client.id)) {
            return state;
          }
          return { selectedClients: [...state.selectedClients, client] };
        }),
      removeClient: (clientId) =>
        set((state) => ({
          selectedClients: state.selectedClients.filter((c) => c.id !== clientId),
        })),
      clearClients: () => set({ selectedClients: [] }),
      isClientSelected: (clientId) =>
        get().selectedClients.some((c) => c.id === clientId),
    }),
    {
      name: 'selected-clients-storage',
    }
  )
);
