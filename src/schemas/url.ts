import { celebrate, Joi, Segments } from 'celebrate';

export const encodeUrlSchema = celebrate(
  {
    [Segments.BODY]: Joi.object()
      .keys({
        originalUrl: Joi.string().required().uri().messages({
          'any.required': 'Original URL is required',
          'string.uri': 'Original URL must be a valid URL',
          'string.empty': 'Original URL cannot be empty',
        }),
      })
      .required(),
  },
  {
    abortEarly: false,
  }
);

export const decodeUrlSchema = celebrate(
  {
    [Segments.BODY]: Joi.object()
      .keys({
        shortUrl: Joi.string().required().messages({
          'any.required': 'Short URL is required',
          'string.empty': 'Short URL cannot be empty',
        }),
      })
      .required(),
  },
  {
    abortEarly: false,
  }
);

export const getUrlStatisticsSchema = celebrate(
  {
    [Segments.PARAMS]: Joi.object()
      .keys({
        url_path: Joi.string().required().messages({
          'any.required': 'URL path is required',
          'string.empty': 'URL path cannot be empty',
        }),
      })
      .required(),
  },
  {
    abortEarly: false,
  }
);

export const listUrlsSchema = celebrate(
  {
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().min(3).allow('').messages({
        'string.min': 'Search term must be at least 3 characters long',
      }),
    }),
  },
  {
    abortEarly: false,
  }
);

export const redirectUrlSchema = celebrate(
  {
    [Segments.PARAMS]: Joi.object()
      .keys({
        url_path: Joi.string().required().messages({
          'any.required': 'URL path is required',
          'string.empty': 'URL path cannot be empty',
        }),
      })
      .required(),
  },
  {
    abortEarly: false,
  }
);