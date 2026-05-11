import { UserLogin, UserRegistration } from '../interface/auth.interface.js';
import prisma from '../db/database.js';
import { ApiError } from '../error/apiError.js';
import bcrypt from 'bcrypt';
import { SessionService } from './Session.service.js';
import { Response } from 'express';

export const AuthService = {
  async register(userData: UserRegistration) {
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
  },
  async login(credentials: UserLogin, res: Response) {
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
      role:`${user.role}`,
      tier: `${user.tier}`,
    }).SignToken(res);
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
    };
  },
};
