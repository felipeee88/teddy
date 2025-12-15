import apiClient from '../../../shared/lib/apiClient';
import { Client, CreateClientDTO, UpdateClientDTO, PagedResult } from '../../../shared/types/client';

class ClientsService {
  async getClients(page: number = 1, pageSize: number = 16): Promise<PagedResult<Client>> {
    const response = await apiClient.get<PagedResult<Client>>('/api/v1/clients', {
      params: { page, pageSize },
    });
    return response.data;
  }

  async getClientById(id: string): Promise<Client> {
    const response = await apiClient.get<Client>(`/api/v1/clients/${id}`);
    return response.data;
  }

  async createClient(client: CreateClientDTO): Promise<Client> {
    const response = await apiClient.post<Client>('/api/v1/clients', client);
    return response.data;
  }

  async updateClient(id: string, client: UpdateClientDTO): Promise<Client> {
    const response = await apiClient.put<Client>(`/api/v1/clients/${id}`, client);
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/clients/${id}`);
  }
}

export default new ClientsService();
