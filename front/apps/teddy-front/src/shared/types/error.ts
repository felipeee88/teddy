export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
