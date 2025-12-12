import apiClient from '../../../shared/lib/apiClient';
import { Client } from '../../../shared/lib/selectedClients.store';

interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  pageSize: number;
}

let mockClients: Client[] = [
  { id: 1, name: 'João Silva', salary: 5000, companyValuation: 100000 },
  { id: 2, name: 'Maria Santos', salary: 6500, companyValuation: 150000 },
  { id: 3, name: 'Pedro Oliveira', salary: 4500, companyValuation: 90000 },
  { id: 4, name: 'Ana Costa', salary: 7000, companyValuation: 200000 },
  { id: 5, name: 'Carlos Ferreira', salary: 5500, companyValuation: 120000 },
  { id: 6, name: 'Juliana Lima', salary: 8000, companyValuation: 250000 },
  { id: 7, name: 'Roberto Alves', salary: 4800, companyValuation: 95000 },
  { id: 8, name: 'Fernanda Souza', salary: 6000, companyValuation: 130000 },
  { id: 9, name: 'Lucas Martins', salary: 5200, companyValuation: 110000 },
  { id: 10, name: 'Patricia Rocha', salary: 7500, companyValuation: 180000 },
];

let nextId = 11;

class ClientsService {
  async getClients(page: number, pageSize: number): Promise<ClientsResponse> {
    try {
      const response = await apiClient.get<ClientsResponse>('/clients', {
        params: { page, pageSize },
      });
      return response.data;
    } catch {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        clients: mockClients.slice(start, end),
        total: mockClients.length,
        page,
        pageSize,
      };
    }
  }

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const response = await apiClient.post<Client>('/clients', client);
      return response.data;
    } catch {
      const newClient = { ...client, id: nextId++ };
      mockClients = [...mockClients, newClient];
      return newClient;
    }
  }

  async updateClient(id: number, client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const response = await apiClient.put<Client>(`/clients/${id}`, client);
      return response.data;
    } catch {
      const index = mockClients.findIndex((c) => c.id === id);
      if (index !== -1) {
        mockClients[index] = { ...client, id };
      }
      return { ...client, id };
    }
  }

  async deleteClient(id: number): Promise<void> {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch {
      mockClients = mockClients.filter((c) => c.id !== id);
    }
  }
}

export default new ClientsService();
