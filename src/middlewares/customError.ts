import HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { isCelebrateError } from 'celebrate';

import { apiResponse } from '../utilities/response';
import logger from '../utilities/logger';
import ErrorHandler from '../errors/errorHandler';

const handleErrors: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ErrorHandler) {
    logger.error('HANDLED ERROR ==> ', err);
    apiResponse(res, err.message, err.getHttpCode());
    return;
  }

  if (isCelebrateError(err)) {
    const errorBody =
      err.details.get('body') || err.details.get('query') || err.details.get('params');

    const errors = errorBody!.details.reduce((acc: any, val) => {
      const key = val.path.join('.');
      const message = val.message.replace(/['"]+/g, '');
      acc[key] = { message };
      return acc;
    }, {});

    let mainErrorMessage = 'Bad request. Please check your inputs';
    if (errorBody!.details.length > 0) {
      const firstError = errorBody!.details[0];
      mainErrorMessage = firstError.message.replace(/['"]+/g, '');
    }

    logger.error(`Bad Request ==> ${JSON.stringify(errors)}`);

    apiResponse(res, mainErrorMessage, HttpStatus.BAD_REQUEST, errors);
    return;
  }

  logger.error(`Internal Error --> ${JSON.stringify(err)}`);

  apiResponse(res, 'Internal server error, please report this to the support team', 500);
};

export default handleErrors;
