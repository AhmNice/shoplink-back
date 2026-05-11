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
