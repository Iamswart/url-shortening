import UrlController from '../src/controllers/url';
import { findUrl, createUrl, updateUrl, fetchAndCountUrls } from '../src/database/repositories/url';
import { generateShortPath } from '../src/services/url';
import { BadRequestError } from '../src/errors';
import { UrlAttributes } from '../src/database/models/url'; 

jest.mock('../src/database/repositories/url', () => ({
  findUrl: jest.fn(),
  createUrl: jest.fn(),
  updateUrl: jest.fn(),
  fetchAndCountUrls: jest.fn(),
}));

jest.mock('../src/services/url', () => ({
  generateShortPath: jest.fn(),
}));

jest.mock('../src/utilities/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UrlController', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      protocol: 'http',
      get: jest.fn().mockReturnValue('example.com'),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
      render: jest.fn(),
      locals: {
        paginate: {
          limit: 10,
          offset: 0,
          page: 1,
          url: 'http://example.com/api/url/list',
        },
      },
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('encodeUrl', () => {
    it('should return existing short URL if the original URL already exists', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 0,
        created_at: new Date(),
      };

      req.body.originalUrl = 'https://example.com/long-url';
      (findUrl as jest.Mock).mockResolvedValue(mockUrl);

      await UrlController.encodeUrl(req, res, next);

      expect(findUrl).toHaveBeenCalledWith({ original_url: 'https://example.com/long-url' });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          originalUrl: 'https://example.com/long-url',
          shortUrl: 'http://example.com/abc123',
          shortPath: 'abc123',
        },
      });
    });

    it('should create a new short URL if the original URL does not exist', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 0,
        created_at: new Date(),
      };

      req.body.originalUrl = 'https://example.com/long-url';
      (findUrl as jest.Mock).mockResolvedValue(null);
      (generateShortPath as jest.Mock).mockReturnValue('abc123');
      (createUrl as jest.Mock).mockResolvedValue(mockUrl);

      await UrlController.encodeUrl(req, res, next);

      expect(findUrl).toHaveBeenCalledWith({ original_url: 'https://example.com/long-url' });
      expect(generateShortPath).toHaveBeenCalled();
      expect(createUrl).toHaveBeenCalledWith({
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 0,
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          originalUrl: 'https://example.com/long-url',
          shortUrl: 'http://example.com/abc123',
          shortPath: 'abc123',
        },
      });
    });

    it('should throw an error if originalUrl is missing', async () => {
      req.body.originalUrl = '';

      await UrlController.encodeUrl(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe('decodeUrl', () => {
    it('should return the original URL when a valid short URL is provided', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 0,
        created_at: new Date(),
      };

      req.body.shortUrl = 'abc123';
      (findUrl as jest.Mock).mockResolvedValue(mockUrl);

      await UrlController.decodeUrl(req, res, next);

      expect(findUrl).toHaveBeenCalledWith({ short_path: 'abc123' });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          originalUrl: 'https://example.com/long-url',
          shortUrl: 'http://example.com/abc123',
          shortPath: 'abc123',
        },
      });
    });

    it('should extract path from full URL when provided', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 0,
        created_at: new Date(),
      };

      req.body.shortUrl = 'http://example.com/abc123';
      (findUrl as jest.Mock).mockResolvedValue(mockUrl);

      await UrlController.decodeUrl(req, res, next);

      expect(findUrl).toHaveBeenCalledWith({ short_path: 'abc123' });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          originalUrl: 'https://example.com/long-url',
          shortUrl: 'http://example.com/abc123',
          shortPath: 'abc123',
        },
      });
    });

    it('should throw an error if shortUrl is missing', async () => {
      req.body.shortUrl = '';

      await UrlController.decodeUrl(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should throw an error if short URL is not found', async () => {
      req.body.shortUrl = 'abc123';
      (findUrl as jest.Mock).mockResolvedValue(null);

      await UrlController.decodeUrl(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe('getUrlStatistics', () => {
    it('should return URL statistics including last visited', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 5,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-10'),
      };
      
      req.params.url_path = 'abc123';
      (findUrl as jest.Mock).mockResolvedValue(mockUrl);

      await UrlController.getUrlStatistics(req, res, next);

      expect(findUrl).toHaveBeenCalledWith({ short_path: 'abc123' });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          shortPath: 'abc123',
          originalUrl: 'https://example.com/long-url',
          visitCount: 5,
          createdAt: mockUrl.created_at,
          daysSinceCreation: expect.any(Number),
          avgVisitsPerDay: expect.any(Number),
          lastVisited: mockUrl.updated_at,
        },
      });
    });

    it('should set lastVisited to null when visit_count is 0', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 0,
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-01'),
      };
      
      req.params.url_path = 'abc123';
      (findUrl as jest.Mock).mockResolvedValue(mockUrl);

      await UrlController.getUrlStatistics(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          shortPath: 'abc123',
          originalUrl: 'https://example.com/long-url',
          visitCount: 0,
          createdAt: mockUrl.created_at,
          daysSinceCreation: expect.any(Number),
          avgVisitsPerDay: expect.any(Number),
          lastVisited: null,
        },
      });
    });

    it('should throw an error if the URL is not found', async () => {
      req.params.url_path = 'nonexistent';
      (findUrl as jest.Mock).mockResolvedValue(null);

      await UrlController.getUrlStatistics(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe('listUrls', () => {
    it('should return a list of URLs with pagination', async () => {
      const mockUrls = {
        rows: [
          {
            id: 1,
            original_url: 'https://example.com/url1',
            short_path: 'abc123',
            visit_count: 5,
            created_at: new Date(),
          },
          {
            id: 2,
            original_url: 'https://example.com/url2',
            short_path: 'def456',
            visit_count: 10,
            created_at: new Date(),
          },
        ] as UrlAttributes[],
        count: 2,
      };

      req.query.search = 'example';
      (fetchAndCountUrls as jest.Mock).mockResolvedValue(mockUrls);

      await UrlController.listUrls(req, res, next);

      expect(fetchAndCountUrls).toHaveBeenCalledWith(
        { searchTerm: 'example' },
        { limit: 10, offset: 0 }
      );
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          payload: expect.arrayContaining([
            expect.objectContaining({
              id: 1,
              originalUrl: 'https://example.com/url1',
              shortPath: 'abc123',
            }),
            expect.objectContaining({
              id: 2,
              originalUrl: 'https://example.com/url2',
              shortPath: 'def456',
            }),
          ]),
          paging: expect.objectContaining({
            total_items: 2,
            current: 1,
            page_size: 10,
          }),
          links: expect.arrayContaining([
            expect.objectContaining({
              rel: 'current',
            })
          ])
        },
      });
    });

    it('should handle search terms properly', async () => {
      const mockUrls = { 
        rows: [] as UrlAttributes[],
        count: 0 
      };
      
      req.query.search = 'specific';
      (fetchAndCountUrls as jest.Mock).mockResolvedValue(mockUrls);

      await UrlController.listUrls(req, res, next);

      expect(fetchAndCountUrls).toHaveBeenCalledWith(
        { searchTerm: 'specific' },
        expect.any(Object)
      );
    });
  });

  describe('redirectToOriginalUrl', () => {
    it('should redirect to the original URL and increment visit count', async () => {
      const mockUrl = {
        id: 1,
        original_url: 'https://example.com/long-url',
        short_path: 'abc123',
        visit_count: 5,
        created_at: new Date(),
      };

      req.params.url_path = 'abc123';
      (findUrl as jest.Mock).mockResolvedValue(mockUrl);
      (updateUrl as jest.Mock).mockResolvedValue([1]);

      await UrlController.redirectToOriginalUrl(req, res, next);

      expect(findUrl).toHaveBeenCalledWith({ short_path: 'abc123' });
      expect(updateUrl).toHaveBeenCalledWith(1, { visit_count: 6 });
      expect(res.redirect).toHaveBeenCalledWith(301, 'https://example.com/long-url');
    });

    it('should return 404 if the URL is not found', async () => {
      req.params.url_path = 'nonexistent';
      (findUrl as jest.Mock).mockResolvedValue(null);

      await UrlController.redirectToOriginalUrl(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.render).toHaveBeenCalledWith('404', { message: 'URL not found' });
      expect(updateUrl).not.toHaveBeenCalled();
    });

    it('should handle errors and pass to next middleware', async () => {
      req.params.url_path = 'abc123';
      const error = new Error('Database error');
      (findUrl as jest.Mock).mockRejectedValue(error);

      await UrlController.redirectToOriginalUrl(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});