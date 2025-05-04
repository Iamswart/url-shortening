/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import Redis from 'ioredis';

import env from './config/env';
import customErrorMiddleware from './middlewares/customError';
import { init as initializeRedis } from './utilities/redis';
import { routes } from './routes';



initializeRedis(new Redis(env.redis));

const app = express();

app.use(cors());
app.options('*', cors());
app.use(helmet());

app.use(compression());

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: any, res: any) => {
  res.json({ message: 'The breet server response' });
});

app.use(routes);

app.use(customErrorMiddleware);

// handle 404 errors
app.use((req: any, res: any, _next: any): void => {
  res.status(404).json({
    status: false,
    message: 'resource not found',
    data: null,
    path: req.url,
  });
});

app.use((err: any, req: any, res: any): void => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json(err);
});

export default app;
