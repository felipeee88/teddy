import { describe, it, expect, vi, beforeEach } from 'vitest';
import clientsService from './clients.service';
import apiClient from '../../../shared/lib/apiClient';

vi.mock('../../../shared/lib/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ClientsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClients', () => {
    it('deve chamar endpoint correto com parâmetros', async () => {
      const mockResponse = {
        data: {
          items: [],
          page: 1,
          pageSize: 16,
          totalItems: 0,
          totalPages: 0,
        },
      };
      
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await clientsService.getClients(1, 16);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/clients', {
        params: { page: 1, pageSize: 16 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createClient', () => {
    it('deve enviar payload correto', async () => {
      const newClient = {
        name: 'Novo Cliente',
        salary: 5000,
        companyValue: 100000,
      };
      
      const mockResponse = {
        data: { 
          ...newClient, 
          id: '999',
          accessCount: 0,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
      };
      
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await clientsService.createClient(newClient);

      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/clients', newClient);
      expect(result.id).toBe('999');
      expect(result.name).toBe('Novo Cliente');
    });
  });

  describe('updateClient', () => {
    it('deve usar ID correto no endpoint', async () => {
      const updatedClient = {
        name: 'Cliente Atualizado',
        salary: 7000,
        companyValuation: 200000,
      };
      
      const mockResponse = {
        data: { ...updatedClient, id: 123 },
      };
      
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      await clientsService.updateClient(123, updatedClient);
  describe('updateClient', () => {
    it('deve usar ID correto no endpoint', async () => {
      const updatedClient = {
        name: 'Cliente Atualizado',
        salary: 7000,
        companyValue: 200000,
      };
      
      const mockResponse = {
        data: { 
          ...updatedClient, 
          id: '123',
          accessCount: 5,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02'
        },
      };
      
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      await clientsService.updateClient('123', updatedClient);

      expect(apiClient.put).toHaveBeenCalledWith('/api/v1/clients/123', updatedClient);
    });

    it('deve retornar cliente atualizado', async () => {
      const updatedClient = {
        name: 'Teste Update',
        salary: 8000,
        companyValue: 250000,
      };
      
      const mockResponse = {
        data: { 
          ...updatedClient, 
          id: '456',
          accessCount: 3,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-03'
        },
      };
      
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      const result = await clientsService.updateClient('456', updatedClient);

      expect(result.id).toBe('456');
      expect(result.name).toBe('Teste Update');
    });
  });

  describe('deleteClient', () => {
    it('deve chamar endpoint com ID correto', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: null });

      await clientsService.deleteClient('789');

      expect(apiClient.delete).toHaveBeenCalledWith('/api/v1/clients/789');
    });
  });
});
