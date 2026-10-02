export type ApiErrorResponse = {
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  timestamp?: string;
};

export class ApiError extends Error {
  status: number;

  details?: ApiErrorResponse;

  constructor(
    status: number,
    message: string,
    details?: ApiErrorResponse,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}