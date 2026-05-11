import { NextFunction, Request, Response } from "express";
import { SessionService } from "../service/Session.service";
import { asyncHandler } from "../util/asyn";
import { ApiError } from "../error/apiError";
import { config } from "../config/config";
import { SessionPayload } from "../interface/auth.interface";
import jwt from "jsonwebtoken";
import prisma from "../db/database.js";
export interface AuthRequest extends Request {
  user?: SessionPayload;
}


export const verifyJWT = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new ApiError({ statusCode: 401, message: 'Unauthorized request' });
      }

      const decodedToken: any = jwt.verify(token, config.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new ApiError({ statusCode: 401, message: 'Invalid Access Token' });
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(
        { statusCode: 401, message: error instanceof Error ? error.message : 'Invalid access token' }
      );
    }
  },
);
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await SessionService.VerifyToken(req, res, next);
    } catch (error) {
      next(error);
    }
  },
);