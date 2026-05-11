import { UserLogin, UserRegistration } from '../interface/auth.interface.js';
import prisma from '../db/database.js';
import { ApiError } from '../error/apiError.js';
import bcrypt from 'bcrypt';
import { SessionService } from './Session.service.js';
import { Request, Response } from 'express';

export class AuthService {
  static async register(userData: UserRegistration) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    return await prisma.$transaction(async (tx: any) => {
      const existingUser = await tx.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new ApiError({
          statusCode: 400,
          message: 'User with this email already exists',
        });
      }

      const user = await tx.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        },
      });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
  static async login(credentials: UserLogin, res: Response) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    }

    const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordMatch) {
      throw new ApiError({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    }
    await new SessionService({
      user_id: `${user.id}`,
      userName: `${user.name}`,
      email: `${user.email}`,
      role: `${user.role}`,
      tier: user.tier,
    }).SignToken(res);
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
    };
  }
  static async logout(res: Response) {
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'none' as const,
      secure: true,
      path: '/',
    };

    res.clearCookie('SHOP_LINK_ACCESS_TOKEN', cookieOptions);
    res.clearCookie('SHOP_LINK_REFRESH_TOKEN', cookieOptions);
    return { message: 'Logout successful' };
  }
  static async getCurrentUser(req: Request) {
    if (!req.user) {
      throw new ApiError({ statusCode: 401, message: 'User not authenticated' });
    }

    const userId = req.user.user_id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
