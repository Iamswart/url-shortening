import { RequestHandler } from 'express';
import { BadRequestError } from '../errors';
import { apiResponse, pagingResponse } from '../utilities/response';
import { createUrl, findUrl, updateUrl, fetchAndCountUrls } from '../database/repositories/url';
import { generateShortPath } from '../services/url';
import logger from '../utilities/logger';

class UrlController {
  static encodeUrl: RequestHandler = async (req, res, next) => {
    try {
      const { originalUrl } = req.body;

      if (!originalUrl) {
        throw new BadRequestError('Original URL is required');
      }

      const existingUrl = await findUrl({ original_url: originalUrl });

      if (existingUrl) {
        return apiResponse(res, {
          originalUrl: existingUrl.original_url,
          shortUrl: `${req.protocol}://${req.get('host')}/${existingUrl.short_path}`,
          shortPath: existingUrl.short_path,
        });
      }

      const counter = Date.now() + Math.floor(Math.random() * 1000);
      const shortPath = generateShortPath(counter);

      const newUrl = await createUrl({
        original_url: originalUrl,
        short_path: shortPath,
        visit_count: 0,
      });

      apiResponse(res, {
        originalUrl: newUrl.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${shortPath}`,
        shortPath,
      });
    } catch (error) {
      next(error);
    }
  };

  static decodeUrl: RequestHandler = async (req, res, next) => {
    try {
      const { shortUrl } = req.body;

      if (!shortUrl) {
        throw new BadRequestError('Short URL is required');
      }

      let shortPath = shortUrl;
      try {
        if (shortUrl.includes('/')) {
          const url = new URL(shortUrl);
          shortPath = url.pathname.substring(1);
        }
      } catch (e) {
        logger.info(`URL parsing failed for ${shortUrl}, using as raw path instead`);
      }

      const url = await findUrl({ short_path: shortPath });

      if (!url) {
        throw new BadRequestError('URL not found');
      }

      apiResponse(res, {
        originalUrl: url.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_path}`,
        shortPath: url.short_path,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUrlStatistics: RequestHandler = async (req, res, next) => {
    try {
      const { url_path } = req.params;

      const url = await findUrl({ short_path: url_path });

      if (!url) {
        throw new BadRequestError('URL not found');
      }

      const createdAt = new Date(url.created_at);
      const now = new Date();
      const timeDiffInMs = now.getTime() - createdAt.getTime();
      const daysDiff = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));

      const avgVisitsPerDay =
        daysDiff > 0 ? (url.visit_count / daysDiff).toFixed(2) : url.visit_count;

      let lastVisited = null;
      if (url.visit_count > 0) {
        lastVisited = url.updated_at;
      }

      apiResponse(res, {
        shortPath: url.short_path,
        originalUrl: url.original_url,
        visitCount: url.visit_count,
        createdAt: url.created_at,
        daysSinceCreation: daysDiff,
        avgVisitsPerDay: Number(avgVisitsPerDay),
        lastVisited: lastVisited,
      });
    } catch (error) {
      next(error);
    }
  };

  static listUrls: RequestHandler = async (req, res, next) => {
    try {
      const { limit, offset, url, page } = res.locals.paginate;
      const searchTerm = req.query.search as string;

      const searchFilter = { searchTerm };

      const urls = await fetchAndCountUrls(searchFilter, {
        limit: Number(limit),
        offset,
      });

      const responseUrls = urls.rows.map((url) => ({
        id: url.id,
        originalUrl: url.original_url,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.short_path}`,
        shortPath: url.short_path,
        visitCount: url.visit_count,
        createdAt: url.created_at,
      }));

      apiResponse(res, pagingResponse(responseUrls, urls.count, Number(page), Number(limit), url));
    } catch (error) {
      next(error);
    }
  };

  static redirectToOriginalUrl: RequestHandler = async (req, res, next) => {
    try {
      const { url_path } = req.params;

      const url = await findUrl({ short_path: url_path });

      if (!url) {
        return res.status(404).render('404', { message: 'URL not found' });
      }

      await updateUrl(url.id, { visit_count: url.visit_count + 1 });

      res.redirect(301, url.original_url);
    } catch (error) {
      next(error);
    }
  };
}

export default UrlController;
