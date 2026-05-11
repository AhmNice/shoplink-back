import express from 'express';
import { login, register, logout, getCurrentUser } from '../controller/auth.controller.js';
import { RequestValidation } from '../validation/validate.js';
import { loginSchema, registerSchema } from '../validation/auth.validate.js';
import { protect } from '../middleware/Protect.js';

const authRouter = express.Router();

authRouter.post('/login', RequestValidation(loginSchema), login);
authRouter.post('/register', RequestValidation(registerSchema), register);
authRouter.post('/logout', logout);
authRouter.get('/me', protect, getCurrentUser);

export default authRouter;
