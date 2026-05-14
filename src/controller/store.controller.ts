import { Request, Response } from 'express';
import { asyncHandler } from '../util/asyn.js';
import { StoreService } from '../service/Store.service.js';
import { ApiResponse } from '../util/apiResponse.js';

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  try {
    const store = await StoreService.create(req, req.body);
    res.status(201).json(new ApiResponse(201, store, 'Store created successfully'));
  } catch (error) {
    throw error;
  }
});

export const getAllStores = asyncHandler(async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const filters = { userId: req.query.userId as string | undefined };

    const result = await StoreService.getAll(page, limit, filters);
    res.status(200).json(new ApiResponse(200, result, 'Stores retrieved successfully'));
  } catch (error) {
    throw error;
  }
});

export const getStoreById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const store = await StoreService.getById(`${id}`);
    res.status(200).json(new ApiResponse(200, store, 'Store retrieved successfully'));
  } catch (error) {
    throw error;
  }
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const store = await StoreService.update(`${id}`, req.body);
    res.status(200).json(new ApiResponse(200, store, 'Store updated successfully'));
  } catch (error) {
    throw error;
  }
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const store = await StoreService.delete(`${id}`);
    res.status(200).json(new ApiResponse(200, store, 'Store deleted successfully'));
  } catch (error) {
    throw error;
  }
});

export const getUserStores = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await StoreService.getUserStores(`${userId}`, page, limit);
    res.status(200).json(new ApiResponse(200, result, 'User stores retrieved successfully'));
  } catch (error) {
    throw error;
  }
});

export const getStoreBySlug = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = (req.query.userId as string) || '';
    const store = await StoreService.getBySlug(userId, `${slug}`);
    res.status(200).json(new ApiResponse(200, store, 'Store retrieved successfully'));
  } catch (error) {
    throw error;
  }
});
