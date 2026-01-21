import {
  normalizeEmail,
  emailsMatch,
  isValidEmail,
  createEmailRegex
} from '../emailValidator.js';

describe('Email Validator Utility', () => {
  describe('normalizeEmail', () => {
    it('should convert email to lowercase', () => {
      expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      expect(normalizeEmail('  test@example.com  ')).toBe('test@example.com');
    });

    it('should handle mixed case', () => {
      expect(normalizeEmail('TeSt@ExAmPlE.CoM')).toBe('test@example.com');
    });

    it('should throw error for invalid input', () => {
      expect(() => normalizeEmail(null)).toThrow('Invalid email provided');
      expect(() => normalizeEmail(undefined)).toThrow('Invalid email provided');
      expect(() => normalizeEmail(123)).toThrow('Invalid email provided');
    });
  });

  describe('emailsMatch', () => {
    it('should return true for same emails', () => {
      expect(emailsMatch('test@example.com', 'test@example.com')).toBe(true);
    });

    it('should return true for same emails different case', () => {
      expect(emailsMatch('test@example.com', 'TEST@EXAMPLE.COM')).toBe(true);
      expect(emailsMatch('TeSt@ExAmPlE.CoM', 'test@example.com')).toBe(true);
    });

    it('should return false for different emails', () => {
      expect(emailsMatch('test1@example.com', 'test2@example.com')).toBe(false);
    });

    it('should handle emails with whitespace', () => {
      expect(emailsMatch('  test@example.com  ', 'test@example.com')).toBe(true);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('createEmailRegex', () => {
    it('should create case-insensitive regex', () => {
      const regex = createEmailRegex('test@example.com');
      expect(regex.test('test@example.com')).toBe(true);
      expect(regex.test('TEST@EXAMPLE.COM')).toBe(true);
      expect(regex.test('TeSt@ExAmPlE.CoM')).toBe(true);
    });

    it('should not match different emails', () => {
      const regex = createEmailRegex('test@example.com');
      expect(regex.test('other@example.com')).toBe(false);
    });

    it('should handle special characters', () => {
      const regex = createEmailRegex('test+tag@example.com');
      expect(regex.test('TEST+TAG@EXAMPLE.COM')).toBe(true);
    });
  });
});
