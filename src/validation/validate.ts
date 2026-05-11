import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ApiError } from '../error/apiError';

export const RequestValidation = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        const errors = result.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new ApiError({ statusCode: 422, message: 'Validation Error', data: errors }));
      } else {
        next();
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = (error as any).issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new ApiError({ statusCode: 422, message: 'Validation Error', data: errors }));
      } else {
        next(error);
      }
    }
  };
};
