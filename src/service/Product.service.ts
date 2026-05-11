import { Request } from 'express';
import prisma from '../db/database.js';
import { ApiError } from '../error/apiError.js';
import { CreateProductInput, UpdateProductInput } from '../interface/product.interface.js';
import { FileService } from './FileUpload.service.js';

export const ProductService = {
  async create(req: Request, data: CreateProductInput) {
    console.log(data);
    if (!data.name || !data.price || !data.storeId) {
      throw new ApiError({
        statusCode: 400,
        message: 'Missing required fields: name, price, image, storeId',
      });
    }

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store) {
      throw new ApiError({
        statusCode: 404,
        message: 'Store not found',
      });
    }
    console.log(req.file);
    
    const pictureUrl = await FileService.uploadFile(req.file as Express.Multer.File);
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: pictureUrl,
        originalPrice: Number(data.originalPrice),
        storeId: data.storeId,
      },
      include: {
        store: true,
      },
    });
  },

  async getAll(
    page: number = 1,
    limit: number = 10,
    filters?: { storeId?: string; isActive?: boolean },
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    if (!id) {
      throw new ApiError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        store: true,
      },
    });

    if (!product) {
      throw new ApiError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return product;
  },

  async getByStore(storeId: string, page: number = 1, limit: number = 10) {
    if (!storeId) {
      throw new ApiError({
        statusCode: 400,
        message: 'Store ID is required',
      });
    }

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new ApiError({
        statusCode: 404,
        message: 'Store not found',
      });
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { storeId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({ where: { storeId } }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async update(id: string, data: UpdateProductInput) {
    if (!id) {
      throw new ApiError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ApiError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice;

    return await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        store: true,
      },
    });
  },

  async delete(id: string) {
    if (!id) {
      throw new ApiError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ApiError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return await prisma.product.delete({
      where: { id },
      include: {
        store: true,
      },
    });
  },

  async toggleActive(id: string) {
    if (!id) {
      throw new ApiError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new ApiError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return await prisma.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
      include: {
        store: true,
      },
    });
  },
};
