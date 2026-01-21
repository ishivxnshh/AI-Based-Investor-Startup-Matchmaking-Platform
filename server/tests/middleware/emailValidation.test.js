import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { validateEmail, checkDuplicateEmail, restrictEmailDomains, validateEmailDomain } from '../../middleware/emailValidation.js';
import emailService from '../../services/emailService.js';

describe('Email Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      normalizedEmail: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('validateEmail', () => {
    it('should validate and normalize email', () => {
      req.body.email = 'Test@Example.COM';
      
      validateEmail(req, res, next);

      expect(req.normalizedEmail).toBe('test@example.com');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 for missing email', () => {
      validateEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email is required'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', () => {
      req.body.email = 'invalid-email';
      
      validateEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('Invalid')
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should trim and normalize whitespace', () => {
      req.body.email = '  test@example.com  ';
      
      validateEmail(req, res, next);

      expect(req.normalizedEmail).toBe('test@example.com');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('checkDuplicateEmail', () => {
    let MockModel;

    beforeEach(() => {
      MockModel = {
        findOne: jest.fn()
      };
    });

    it('should allow unique email', async () => {
      req.normalizedEmail = 'test@example.com';
      MockModel.findOne.mockResolvedValue(null);

      const middleware = checkDuplicateEmail(MockModel);
      await middleware(req, res, next);

      expect(MockModel.findOne).toHaveBeenCalledWith({
        email: { $regex: expect.any(RegExp) }
      });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should block duplicate email', async () => {
      req.normalizedEmail = 'test@example.com';
      MockModel.findOne.mockResolvedValue({ _id: '123', email: 'test@example.com' });

      const middleware = checkDuplicateEmail(MockModel);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already exists'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      req.normalizedEmail = 'test@example.com';
      MockModel.findOne.mockRejectedValue(new Error('DB connection failed'));

      const middleware = checkDuplicateEmail(MockModel);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Server error'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if no email provided', async () => {
      const middleware = checkDuplicateEmail(MockModel);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email is required'
      });
    });
  });

  describe('restrictEmailDomains', () => {
    const allowedDomains = ['company.com', 'partner.com'];

    it('should allow email from allowed domain', () => {
      req.normalizedEmail = 'user@company.com';
      
      const middleware = restrictEmailDomains(allowedDomains);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should block email from disallowed domain', () => {
      req.normalizedEmail = 'user@other.com';
      
      const middleware = restrictEmailDomains(allowedDomains);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining('company.com')
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should be case-insensitive for domains', () => {
      req.normalizedEmail = 'user@COMPANY.COM';
      
      const middleware = restrictEmailDomains(allowedDomains);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if no email provided', () => {
      const middleware = restrictEmailDomains(allowedDomains);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateEmailDomain', () => {
    it('should allow valid domain', () => {
      req.normalizedEmail = 'user@example.com';
      
      validateEmailDomain(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should block domain without TLD', () => {
      req.normalizedEmail = 'user@example';
      
      validateEmailDomain(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email domain appears to be invalid'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should block short TLD', () => {
      req.normalizedEmail = 'user@example.c';
      
      validateEmailDomain(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if no email provided', () => {
      validateEmailDomain(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
