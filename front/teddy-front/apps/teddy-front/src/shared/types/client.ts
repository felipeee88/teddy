export interface Client {
  id: number;
  name: string;
  salary: number;
  companyValuation: number;
}

export type CreateClientDTO = Omit<Client, 'id'>;
export type UpdateClientDTO = Omit<Client, 'id'>;

export interface PaginatedResponse<T> {
  clients: T[];
  totalPages: number;
  currentPage: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
