import * as dotenv from "dotenv";

dotenv.config();

export const VERSION = {
  v1: "/api/v1",
};

export default {
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'indicina',
    showDBlogs: process.env.DB_SHOW_LOGS === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    maxRetriesPerRequest: null as any,
    enableReadyCheck: false,
  },
  application: {
    passwordHash: Number(process.env.PASSWORD_HASH) || 12,
  },
  env: process.env.NODE_ENV || ("development" as string),
  isProduction:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod",
  port: process.env.PORT as string,
  auth: {
    secret: process.env.JWT_SECRET || 'secret==',
    tokenExpiration: Number(process.env.JWT_EXPIRATION),
    apiKey: process.env.API_KEY as string,
  },
  baseUrl: process.env.APP_URL || 'http://localhost:3000',
  productionServerUrl: process.env.PRODUCTION_SERVER_URL as string,
};
