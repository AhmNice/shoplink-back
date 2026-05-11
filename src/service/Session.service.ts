import {Response, Request, NextFunction } from "express";
import { config } from "../config/config.js";
import { ApiError } from "../error/apiError.js";
import { SessionPayload } from "../interface/auth.interface.js";
import jwt from "jsonwebtoken";

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionPayload;
  }
}
export class SessionService {
   constructor(private payload: SessionPayload) {}

  async SignToken(
    res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenId = crypto.randomUUID();

    const refreshToken = jwt.sign(
      { ...this.payload, tokenId },
      config.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' },
    );

    const accessToken = jwt.sign(this.payload, config.ACCESS_TOKEN_SECRET!, {
      expiresIn: '15m',
    });



    const cookieOptions = {
      httpOnly: true,
      sameSite: 'none' as const,
      secure: true,
      path: '/',
    };

    res.cookie('SHOP_LINK_REFRESH_TOKEN', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('SHOP_LINK_ACCESS_TOKEN', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    return { accessToken, refreshToken };
  }

  static async VerifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['SHOP_LINK_ACCESS_TOKEN'];

    if (!token) {
      return await SessionService.handleAutomaticRefresh(req, res, next);
    }

    try {
      const decoded = jwt.verify(
        token,
        config.ACCESS_TOKEN_SECRET!,
      ) as SessionPayload;
      req.user = decoded;
      return next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return await SessionService.handleAutomaticRefresh(req, res, next);
      }
      throw new ApiError({ statusCode: 401, message: 'Invalid session' });
    }
  }
  private static async handleAutomaticRefresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const refreshToken = req.cookies['SHOP_LINK_REFRESH_TOKEN'];
    if (!refreshToken) throw new ApiError({ statusCode: 401, message: 'Session expired' });

    try {
      const newAccessToken = await SessionService.refreshToken({ refreshToken, res });
      const decoded = jwt.decode(newAccessToken) as SessionPayload;
      req.user = decoded;
      return next();
    } catch {
      throw new ApiError({ statusCode: 401, message: 'Please log in again' });
    }
  }

  static async refreshToken({
    refreshToken,
    res,
  }: {
    refreshToken: string;
    res: Response;
  }): Promise<string> {
    try {
      if (!refreshToken) {
        throw new ApiError({ statusCode: 401, message: 'Refresh token missing' });
      }
      const decoded = jwt.verify(
        refreshToken,
        config.REFRESH_TOKEN_SECRET!,
      ) as any;

      const session = new SessionService({
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
        tier: decoded.tier,
        userName: decoded.userName,
        isAdmin: decoded.isAdmin,
      });
      const { accessToken } = await session.SignToken(res);
      return accessToken;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.log('Error during token refresh:', error);
      throw new ApiError({ statusCode: 401, message: 'Invalid refresh attempt' });
    }
  }
}