import prisma from '../db/database.js';
import { ApiError } from '../error/apiError';

type Tier = 'FREE' | 'PREMIUM';

const limits = {
  FREE: {
    store: 1,
    product: 20,
  },
  PREMIUM: {
    store: 1,
    product: 1000,
  },
} as const;

export const canCreateResource = async (tx:any = prisma,userId: string, resource: 'store' | 'product'): Promise<boolean> => {
  try {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, tier: true }
    });

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    const tier = user.tier as Tier;
    const tierLimits = limits[tier];

    if (!tierLimits) {
      throw new ApiError({ statusCode: 400, message: 'Invalid user tier' });
    }
    const limit = tierLimits[resource];
    const currentCount = await (prisma[resource] as any).count({
      where: { userId: user.id }
    });

    if (currentCount >= limit) {
      throw new ApiError({
        statusCode: 403,
        message: `Limit reached: Your ${tier} plan only allows ${limit} ${resource}(s).`
      });
    }

    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({ statusCode: 500, message: 'Internal server error checking limits' });
  }
};

export const createResourceIfAllowed = async (
  userId: string,
  resource: 'store' | 'product',
  data: Record<string, any>
): Promise<any> => {
  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, tier: true }
      });

      if (!user) {
        throw new ApiError({ statusCode: 404, message: 'User not found' });
      }

      const tier = user.tier as Tier;
      const tierLimits = limits[tier];

      if (!tierLimits) {
        throw new ApiError({ statusCode: 400, message: 'Invalid user tier' });
      }

      const limit = tierLimits[resource];

      const currentCount = await (tx as any)[resource].count({
        where: { userId: user.id }
      });

      if (currentCount >= limit) {
        throw new ApiError({
          statusCode: 403,
          message: `Limit reached: Your ${tier} plan only allows ${limit} ${resource}(s).`
        });
      }

      // create the resource inside the same transaction to avoid race conditions
      const created = await (tx as any)[resource].create({ data: { ...data, userId: user.id } });
      return created;
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({ statusCode: 500, message: 'Internal server error creating resource' });
  }
};