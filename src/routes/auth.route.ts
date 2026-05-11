import express from 'express';
import { login, register } from '../controller/auth.controller.js';
import { RequestValidation } from '../validation/validate.js';
import { loginSchema, registerSchema } from '../validation/auth.validate.js';
const authRouter = express.Router();

authRouter.post('/login', RequestValidation(loginSchema), login);
authRouter.post('/register', RequestValidation(registerSchema), register);

export default authRouter;
