import { Router } from 'express';
import urlRoutes from './url';

const v1Routes: Router = Router();

v1Routes.use('/url', urlRoutes);

export { v1Routes };
