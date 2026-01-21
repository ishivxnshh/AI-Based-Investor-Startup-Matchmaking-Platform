import { describe, it, expect } from '@jest/globals';
import { EMAIL_CONFIG, EMAIL_ERRORS, EMAIL_SUCCESS, EMAIL_LOG_PREFIX } from '../../constants/emailConstants.js';

describe('Email Constants', () => {
  describe('EMAIL_CONFIG', () => {
    it('should have valid max length', () => {
      expect(EMAIL_CONFIG.MAX_LENGTH).toBe(254);
      expect(EMAIL_CONFIG.MAX_LENGTH).toBeGreaterThan(0);
    });

    it('should have valid max local length', () => {
      expect(EMAIL_CONFIG.MAX_LOCAL_LENGTH).toBe(64);
      expect(EMAIL_CONFIG.MAX_LOCAL_LENGTH).toBeLessThan(EMAIL_CONFIG.MAX_LENGTH);
    });

    it('should have valid max domain length', () => {
      expect(EMAIL_CONFIG.MAX_DOMAIN_LENGTH).toBe(253);
      expect(EMAIL_CONFIG.MAX_DOMAIN_LENGTH).toBeLessThan(EMAIL_CONFIG.MAX_LENGTH);
    });

    it('should have blacklisted domains array', () => {
      expect(Array.isArray(EMAIL_CONFIG.BLACKLISTED_DOMAINS)).toBe(true);
      expect(EMAIL_CONFIG.BLACKLISTED_DOMAINS.length).toBeGreaterThan(0);
    });

    it('should have valid email regex', () => {
      expect(EMAIL_CONFIG.EMAIL_REGEX).toBeInstanceOf(RegExp);
      
      // Test valid emails
      expect(EMAIL_CONFIG.EMAIL_REGEX.test('test@example.com')).toBe(true);
      expect(EMAIL_CONFIG.EMAIL_REGEX.test('user.name@example.co.uk')).toBe(true);
      
      // Test invalid emails
      expect(EMAIL_CONFIG.EMAIL_REGEX.test('invalid')).toBe(false);
      expect(EMAIL_CONFIG.EMAIL_REGEX.test('@example.com')).toBe(false);
      expect(EMAIL_CONFIG.EMAIL_REGEX.test('test@')).toBe(false);
    });

    it('should include common disposable email domains', () => {
      expect(EMAIL_CONFIG.BLACKLISTED_DOMAINS).toContain('tempmail.com');
      expect(EMAIL_CONFIG.BLACKLISTED_DOMAINS).toContain('mailinator.com');
      expect(EMAIL_CONFIG.BLACKLISTED_DOMAINS).toContain('guerrillamail.com');
    });

    it('should have whitelisted domains array', () => {
      expect(Array.isArray(EMAIL_CONFIG.WHITELISTED_DOMAINS)).toBe(true);
    });

    it('should have minimum TLD length', () => {
      expect(EMAIL_CONFIG.MIN_TLD_LENGTH).toBe(2);
      expect(EMAIL_CONFIG.MIN_TLD_LENGTH).toBeGreaterThan(0);
    });
  });

  describe('EMAIL_ERRORS', () => {
    it('should have required error message', () => {
      expect(EMAIL_ERRORS.REQUIRED).toBe('Email is required');
      expect(typeof EMAIL_ERRORS.REQUIRED).toBe('string');
    });

    it('should have invalid format error', () => {
      expect(EMAIL_ERRORS.INVALID_FORMAT).toBe('Invalid email format');
    });

    it('should have too long error', () => {
      expect(EMAIL_ERRORS.TOO_LONG).toContain('254');
    });

    it('should have domain blacklisted error', () => {
      expect(EMAIL_ERRORS.DOMAIN_BLACKLISTED).toContain('not allowed');
    });

    it('should have domain invalid error', () => {
      expect(EMAIL_ERRORS.DOMAIN_INVALID).toContain('invalid');
    });

    it('should have duplicate error', () => {
      expect(EMAIL_ERRORS.DUPLICATE).toContain('already exists');
    });

    it('should have local part too long error', () => {
      expect(EMAIL_ERRORS.LOCAL_PART_TOO_LONG).toContain('64');
    });

    it('should have domain too long error', () => {
      expect(EMAIL_ERRORS.DOMAIN_TOO_LONG).toContain('253');
    });

    it('should have all error messages as strings', () => {
      Object.values(EMAIL_ERRORS).forEach(error => {
        expect(typeof error).toBe('string');
        expect(error.length).toBeGreaterThan(0);
      });
    });
  });

  describe('EMAIL_SUCCESS', () => {
    it('should have validated success message', () => {
      expect(EMAIL_SUCCESS.VALIDATED).toContain('validated');
    });

    it('should have normalized success message', () => {
      expect(EMAIL_SUCCESS.NORMALIZED).toContain('normalized');
    });

    it('should have unique success message', () => {
      expect(EMAIL_SUCCESS.UNIQUE).toContain('unique');
    });

    it('should have all success messages as strings', () => {
      Object.values(EMAIL_SUCCESS).forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('EMAIL_LOG_PREFIX', () => {
    it('should have validation prefix', () => {
      expect(EMAIL_LOG_PREFIX.VALIDATION).toBe('[EmailValidation]');
      expect(EMAIL_LOG_PREFIX.VALIDATION).toMatch(/^\[.*\]$/);
    });

    it('should have normalization prefix', () => {
      expect(EMAIL_LOG_PREFIX.NORMALIZATION).toBe('[EmailNormalization]');
    });

    it('should have duplicate check prefix', () => {
      expect(EMAIL_LOG_PREFIX.DUPLICATE_CHECK).toBe('[DuplicateCheck]');
    });

    it('should have security prefix', () => {
      expect(EMAIL_LOG_PREFIX.SECURITY).toBe('[EmailSecurity]');
    });

    it('should have all prefixes in bracket format', () => {
      Object.values(EMAIL_LOG_PREFIX).forEach(prefix => {
        expect(prefix).toMatch(/^\[.*\]$/);
      });
    });
  });

  describe('Integration', () => {
    it('should have consistent length references', () => {
      expect(EMAIL_ERRORS.TOO_LONG).toContain(EMAIL_CONFIG.MAX_LENGTH.toString());
      expect(EMAIL_ERRORS.LOCAL_PART_TOO_LONG).toContain(EMAIL_CONFIG.MAX_LOCAL_LENGTH.toString());
      expect(EMAIL_ERRORS.DOMAIN_TOO_LONG).toContain(EMAIL_CONFIG.MAX_DOMAIN_LENGTH.toString());
    });

    it('should export all constant groups', () => {
      expect(EMAIL_CONFIG).toBeDefined();
      expect(EMAIL_ERRORS).toBeDefined();
      expect(EMAIL_SUCCESS).toBeDefined();
      expect(EMAIL_LOG_PREFIX).toBeDefined();
    });
  });
});
