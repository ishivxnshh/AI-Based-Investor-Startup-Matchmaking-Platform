import { describe, it, expect, beforeEach } from '@jest/globals';
import emailService from '../../services/emailService.js';

describe('EmailService', () => {
  describe('processEmail', () => {
    it('should validate and normalize a valid email', () => {
      const result = emailService.processEmail('Test@Example.COM');
      
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.com');
      expect(result.error).toBeNull();
    });

    it('should reject invalid email format', () => {
      const result = emailService.processEmail('invalid-email');
      
      expect(result.valid).toBe(false);
      expect(result.normalized).toBeNull();
      expect(result.error).toBe('Invalid email format');
    });

    it('should handle empty email', () => {
      const result = emailService.processEmail('');
      
      expect(result.valid).toBe(false);
      expect(result.normalized).toBeNull();
    });

    it('should handle null email', () => {
      const result = emailService.processEmail(null);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should trim whitespace from email', () => {
      const result = emailService.processEmail('  test@example.com  ');
      
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.com');
    });
  });

  describe('areEmailsEqual', () => {
    it('should return true for same email different case', () => {
      expect(emailService.areEmailsEqual('test@example.com', 'TEST@EXAMPLE.COM')).toBe(true);
    });

    it('should return true for same email with whitespace', () => {
      expect(emailService.areEmailsEqual(' test@example.com ', 'test@example.com')).toBe(true);
    });

    it('should return false for different emails', () => {
      expect(emailService.areEmailsEqual('test1@example.com', 'test2@example.com')).toBe(false);
    });

    it('should handle invalid emails gracefully', () => {
      expect(emailService.areEmailsEqual('invalid', 'also-invalid')).toBe(false);
    });

    it('should return false for null comparison', () => {
      expect(emailService.areEmailsEqual(null, 'test@example.com')).toBe(false);
    });
  });

  describe('sanitizeForLogging', () => {
    it('should mask middle part of email', () => {
      const sanitized = emailService.sanitizeForLogging('testuser@example.com');
      expect(sanitized).toBe('te***er@example.com');
    });

    it('should handle short email local parts', () => {
      const sanitized = emailService.sanitizeForLogging('test@example.com');
      expect(sanitized).toBe('t***@example.com');
    });

    it('should handle very short local parts', () => {
      const sanitized = emailService.sanitizeForLogging('ab@example.com');
      expect(sanitized).toBe('a***@example.com');
    });

    it('should handle invalid email format', () => {
      const sanitized = emailService.sanitizeForLogging('invalid-email');
      expect(sanitized).toBe('[MALFORMED_EMAIL]');
    });

    it('should handle null email', () => {
      const sanitized = emailService.sanitizeForLogging(null);
      expect(sanitized).toBe('[INVALID_EMAIL]');
    });

    it('should handle empty string', () => {
      const sanitized = emailService.sanitizeForLogging('');
      expect(sanitized).toBe('[INVALID_EMAIL]');
    });
  });

  describe('hasValidDomain', () => {
    it('should return true for valid domain', () => {
      expect(emailService.hasValidDomain('test@example.com')).toBe(true);
    });

    it('should return true for subdomain', () => {
      expect(emailService.hasValidDomain('test@mail.example.com')).toBe(true);
    });

    it('should return false for missing TLD', () => {
      expect(emailService.hasValidDomain('test@example')).toBe(false);
    });

    it('should return false for short TLD', () => {
      expect(emailService.hasValidDomain('test@example.c')).toBe(false);
    });

    it('should return false for invalid format', () => {
      expect(emailService.hasValidDomain('invalid')).toBe(false);
    });

    it('should return false for missing domain', () => {
      expect(emailService.hasValidDomain('test@')).toBe(false);
    });

    it('should return false for short domain', () => {
      expect(emailService.hasValidDomain('test@ex')).toBe(false);
    });
  });

  describe('getEmailStats', () => {
    it('should return correct stats for valid emails', () => {
      const emails = [
        'test1@example.com',
        'TEST1@example.com',
        'test2@example.com',
        'invalid-email',
        'test3@example.com'
      ];

      const stats = emailService.getEmailStats(emails);

      expect(stats.total).toBe(5);
      expect(stats.valid).toBe(4);
      expect(stats.invalid).toBe(1);
      expect(stats.unique).toBe(3);
      expect(stats.duplicates).toBe(1);
    });

    it('should handle empty array', () => {
      const stats = emailService.getEmailStats([]);

      expect(stats.total).toBe(0);
      expect(stats.valid).toBe(0);
      expect(stats.invalid).toBe(0);
      expect(stats.unique).toBe(0);
    });

    it('should handle non-array input', () => {
      const stats = emailService.getEmailStats(null);

      expect(stats.total).toBe(0);
      expect(stats.valid).toBe(0);
    });

    it('should detect all duplicates', () => {
      const emails = [
        'test@example.com',
        'TEST@example.com',
        'Test@Example.COM'
      ];

      const stats = emailService.getEmailStats(emails);

      expect(stats.total).toBe(3);
      expect(stats.unique).toBe(1);
      expect(stats.duplicates).toBe(2);
    });

    it('should handle mix of valid and invalid emails', () => {
      const emails = [
        'valid@example.com',
        'invalid',
        'also-invalid',
        'another@valid.com'
      ];

      const stats = emailService.getEmailStats(emails);

      expect(stats.total).toBe(4);
      expect(stats.valid).toBe(2);
      expect(stats.invalid).toBe(2);
      expect(stats.unique).toBe(2);
    });
  });
});
