export interface Client {
  id: string;
  name: string;
  salary: number;
  companyValue: number;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDTO {
  name: string;
  salary: number;
  companyValue: number;
}

export interface UpdateClientDTO {
  name: string;
  salary: number;
  companyValue: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface LoginRequest {
  name: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
  expiresIn: number;
}
