import { Router } from 'express';

import {
  encodeUrlSchema,
  decodeUrlSchema,
  getUrlStatisticsSchema,
  listUrlsSchema,
} from '../../schemas/url';
import paginate from '../../middlewares/paginate';
import UrlController from '../../controllers/url';

const urlRouter = Router();

urlRouter.post('/encode', encodeUrlSchema, UrlController.encodeUrl);

urlRouter.post('/decode', decodeUrlSchema, UrlController.decodeUrl);

urlRouter.get('/statistic/:url_path', getUrlStatisticsSchema, UrlController.getUrlStatistics);

urlRouter.get('/list', paginate(), listUrlsSchema, UrlController.listUrls);

export default urlRouter;
