import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config';
import cookieParser from 'cookie-parser';
import { errorHandler } from './error/errorHandler';
import router from './routes';
import { requestLogger } from './middleware/logger.js';
dotenv.config();

const app = express();
app.use(requestLogger);
app.use(
  cors({
    origin: `${config.CLIENT_URL}`,
    methods: 'GET,POST,PUT,DELETE , PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1', router);
app.use(errorHandler);

export default app;
