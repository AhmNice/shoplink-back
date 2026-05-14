import { NextFunction, Request, Response } from 'express';
import { ApiError } from './apiError.js';
import { config } from '../config/config.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  const _next = next;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error.name === 'PrismaClientKnownRequestError' ? 400 : 500);

    const message = config.NODE_ENV === 'development' ? error.message : 'Something went wrong';

    error = new ApiError({ statusCode, message, details: [], data: [] });
  }

  const response = {
    message: error.message || "Internal Server Error",
    statusCode: error.statusCode,
    errors: error.errors || [],
    data: error.data || undefined,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };
  res.status(response.statusCode).json(response);
};
