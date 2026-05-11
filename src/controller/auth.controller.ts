import { Request, Response } from 'express';
import { asyncHandler } from '../util/asyn.js';
import { AuthService } from '../service/Auth.service.js';
import { ApiResponse } from '../util/apiResponse.js';

export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.login({ email, password }, res);
    res.status(200).json(new ApiResponse(200, user, 'Login successful'));
  } catch (error) {
    throw error;
  }
});
export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const user = await AuthService.register({ email, password, name });
    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  } catch (error) {
    throw error;
  }
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await AuthService.logout(res);
    res.status(200).json(new ApiResponse(200, result, 'Logout successful'));
  } catch (error) {
    throw error;
  }
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getCurrentUser(req);
    res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
  } catch (error) {
    throw error;
  }
});
