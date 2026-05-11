import dotenv from 'dotenv';
dotenv.config();
interface Config {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;
  CLIENT_URL: string;
  CLIENT_URL_PROD: string;
  CLIENT_URL_DEV: string;
  NODE_ENV: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  CLOUD_NAME: string;
  CLOUD_API_KEY: string;
  CLOUD_SECRET: string;
}
export const config: Config = {
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  DATABASE_URL: process.env.DATABASE_URL || 'your_database_url',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  CLIENT_URL_PROD: process.env.CLIENT_URL_PROD || 'https://shoplink-frontend.vercel.app',
  CLIENT_URL_DEV: process.env.CLIENT_URL_DEV || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret',
  CLOUD_NAME: process.env.CLOUD_NAME || 'your_cloud_name',
  CLOUD_API_KEY: process.env.CLOUDINARY_API_KEY || 'your_cloud_api_key',
  CLOUD_SECRET: process.env.CLOUDINARY_SECRET_KEY || 'your_cloud_secret',
};
