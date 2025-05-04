import { RequestHandler } from 'express';
import envs from '../config/env';

const paginate =
  (defaultLimit = 20, maxLimit = 50): RequestHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req, res, next): any => {
    res.locals.paginate = {};

    let page = 1;
    let limit = 50;

    page = req.query.page !== undefined ? parseInt(req.query.page as string, 10) || 1 : 1;
    limit =
      req.query.limit !== undefined ? parseInt(req.query.limit as string, 10) || 0 : defaultLimit;

    if (limit > maxLimit) {
      limit = maxLimit;
    }

    if (page < 1) {
      page = 1;
    }

    if (limit < 0) {
      limit = defaultLimit;
    }

    res.locals.paginate.page = page;
    res.locals.paginate.limit = limit;
    res.locals.paginate.hasPreviousPages = page > 1;
    res.locals.paginate.skip = res.locals.paginate.offset = (page - 1) * limit;
    res.locals.paginate.url = `${envs.baseUrl}${req.originalUrl}`;

    next();
  };

export default paginate;
