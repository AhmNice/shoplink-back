import { CreateStoreInput, UpdateStoreInput } from '../interface/store.interface.js';
import prisma from '../db/database.js';
import { ApiError } from '../error/apiError.js';
import { generateUniqueSlug } from '../util/slug.js';
import { canCreateResource } from '../util/store.helper.js';
import { config } from '../config/config.js';
import { Request } from 'express';
import { FileService } from './FileUpload.service.js';

export class StoreService {
  static async create(req: Request, storeData: CreateStoreInput) {
    const requestUser = req.user;
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: requestUser?.user_id },
      });
      if (!user) {
        throw new ApiError({ statusCode: 404, message: 'User not found' });
      }
      const canCreate = await canCreateResource(tx, user.id, 'store');
      if (!canCreate) {
        throw new ApiError({ statusCode: 403, message: 'You are not allowed to create a store' });
      }
      const logo = await FileService.uploadFile(req.file as Express.Multer.File);
      let fileToLogoUrl = '';
      if (logo) {
        fileToLogoUrl = logo;
      } else {
        fileToLogoUrl =
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN0b3JlfGVufDB8fDB8fHww';
      }
      const slug = await generateUniqueSlug(storeData.name);
      const link = `${config.CLIENT_URL}/store/${slug}`;
      return await tx.store.create({
        data: {
          name: storeData.name,
          description: storeData.description,
          address: storeData.address,
          phone: storeData.phone || '',
          category: storeData.category,
          slug,
          link,
          logo: fileToLogoUrl,
          userId: requestUser?.user_id || storeData.userId,
          deliveryTime: storeData.deliveryTime || '',
          minOrder: Number(storeData.minOrder) || null,
          deliveryFee: Number(storeData.deliveryFee) || null,
        },
      });
    });

    return result;
  }

  static async getAll(page = 1, limit = 10, filters?: { userId?: string }) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.store.count({ where }),
    ]);

    return {
      data: stores,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string) {
    if (!id) {
      throw new ApiError({ statusCode: 400, message: 'Store ID is required' });
    }

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new ApiError({ statusCode: 404, message: 'Store not found' });
    }
    return store;
  }

  static async update(id: string, data: UpdateStoreInput) {
    if (!id) {
      throw new ApiError({ statusCode: 400, message: 'Store ID is required' });
    }

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new ApiError({ statusCode: 404, message: 'Store not found' });
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.logo !== undefined) updateData.logo = data.logo;
    if (data.deliveryTime !== undefined) updateData.deliveryTime = data.deliveryTime;
    if (data.minOrder !== undefined) updateData.minOrder = Number(data.minOrder);
    if (data.deliveryFee !== undefined) updateData.deliveryFee = Number(data.deliveryFee);

    return await prisma.store.update({ where: { id }, data: updateData });
  }

  static async delete(id: string) {
    if (!id) {
      throw new ApiError({ statusCode: 400, message: 'Store ID is required' });
    }

    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      throw new ApiError({ statusCode: 404, message: 'Store not found' });
    }

    return await prisma.store.delete({ where: { id } });
  }

  static async getUserStores(userId: string, page = 1, limit = 10) {
    if (!userId) {
      throw new ApiError({ statusCode: 400, message: 'User ID is required' });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    const skip = (page - 1) * limit;

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.store.count({ where: { userId } }),
    ]);

    return {
      data: stores,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }
  static async getBySlug(userId: string, slug: string) {
    if (!slug) {
      throw new ApiError({ statusCode: 400, message: 'Slug is required' });
    }

    // If userId provided, scope to user's store, otherwise find by slug globally
    const where: any = { slug };
    if (userId) where.userId = userId;

    const store = await prisma.store.findFirst({ where, include: { products: true } });
    if (!store) {
      throw new ApiError({ statusCode: 404, message: 'Store not found' });
    }
    return store;
  }
}
