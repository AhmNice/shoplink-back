import { Request, Response } from 'express';
import { asyncHandler } from '../util/asyn.js';
import { ProductService } from '../service/Product.service.js';
import { ApiResponse } from '../util/apiResponse.js';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const product = await ProductService.create(req, req.body);
    res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
  } catch (error) {
    throw error;
  }
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const filters = {
      storeId: req.query.storeId as string | undefined,
      isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
    };

    const result = await ProductService.getAll(page, limit, filters);
    res.status(200).json(new ApiResponse(200, result, 'Products retrieved successfully'));
  } catch (error) {
    throw error;
  }
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getById(`${id}`);
    res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
  } catch (error) {
    throw error;
  }
});

export const getProductsByStore = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { storeId } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await ProductService.getByStore(`${storeId}`, page, limit);
    res.status(200).json(new ApiResponse(200, result, 'Store products retrieved successfully'));
  } catch (error) {
    throw error;
  }
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductService.update(`${id}`, req.body);
    res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error) {
    throw error;
  }
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductService.delete(`${id}`);
    res.status(200).json(new ApiResponse(200, product, 'Product deleted successfully'));
  } catch (error) {
    throw error;
  }
});

export const toggleProductActive = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductService.toggleActive(`${id}`);
    res.status(200).json(new ApiResponse(200, product, 'Product status toggled successfully'));
  } catch (error) {
    throw error;
  }
});
