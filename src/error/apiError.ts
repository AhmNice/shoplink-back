interface ApiErrorOptions {
  statusCode?: number;
  message: string;
  details?: any;
  data?: any;
}
export class ApiError extends Error {
  public statusCode: number;
  public details?: any;
  public data?: any;
  public success: boolean = false;

  constructor({ statusCode = 500, message, details, data }: ApiErrorOptions) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
    this.data = data;
    this.success = statusCode < 400;

    Error.captureStackTrace(this, this.constructor);
  }
}
