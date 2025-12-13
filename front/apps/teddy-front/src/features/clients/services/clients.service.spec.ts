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
          clients: [],
          total: 0,
          page: 1,
          pageSize: 16,
        },
      };
      
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await clientsService.getClients(1, 16);

      expect(apiClient.get).toHaveBeenCalledWith('/clients', {
        params: { page: 1, pageSize: 16 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('deve retornar mock quando API falha', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('API Error'));

      const result = await clientsService.getClients(1, 16);

      expect(result.clients).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('createClient', () => {
    it('deve enviar payload correto', async () => {
      const newClient = {
        name: 'Novo Cliente',
        salary: 5000,
        companyValuation: 100000,
      };
      
      const mockResponse = {
        data: { ...newClient, id: 999 },
      };
      
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await clientsService.createClient(newClient);

      expect(apiClient.post).toHaveBeenCalledWith('/clients', newClient);
      expect(result.id).toBe(999);
      expect(result.name).toBe('Novo Cliente');
    });

    it('deve criar cliente no mock quando API falha', async () => {
      const newClient = {
        name: 'Cliente Mock',
        salary: 6000,
        companyValuation: 150000,
      };
      
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('API Error'));

      const result = await clientsService.createClient(newClient);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Cliente Mock');
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

      expect(apiClient.put).toHaveBeenCalledWith('/clients/123', updatedClient);
    });

    it('deve retornar cliente atualizado', async () => {
      const updatedClient = {
        name: 'Teste Update',
        salary: 8000,
        companyValuation: 250000,
      };
      
      const mockResponse = {
        data: { ...updatedClient, id: 456 },
      };
      
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      const result = await clientsService.updateClient(456, updatedClient);

      expect(result.id).toBe(456);
      expect(result.name).toBe('Teste Update');
    });
  });

  describe('deleteClient', () => {
    it('deve chamar endpoint com ID correto', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: null });

      await clientsService.deleteClient(789);

      expect(apiClient.delete).toHaveBeenCalledWith('/clients/789');
    });

    it('deve funcionar com mock quando API falha', async () => {
      vi.mocked(apiClient.delete).mockRejectedValueOnce(new Error('API Error'));

      await expect(clientsService.deleteClient(1)).resolves.not.toThrow();
    });
  });
});
