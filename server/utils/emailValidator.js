/**
 * Email Validation Utility
 * Provides case-insensitive email validation and normalization
 */

/**
 * Normalize email to lowercase and trim whitespace
 * @param {string} email - The email address to normalize
 * @returns {string} Normalized email
 */
export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email provided');
  }
  return email.toLowerCase().trim();
};

/**
 * Check if two emails are the same (case-insensitive)
 * @param {string} email1 - First email
 * @param {string} email2 - Second email  
 * @returns {boolean} True if emails match
 */
export const emailsMatch = (email1, email2) => {
  return normalizeEmail(email1) === normalizeEmail(email2);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Create case-insensitive regex for email matching
 * @param {string} email - Email to create regex for
 * @returns {RegExp} Case-insensitive regex
 */
export const createEmailRegex = (email) => {
  const normalized = normalizeEmail(email);
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped}$`, 'i');
};

export default {
  normalizeEmail,
  emailsMatch,
  isValidEmail,
  createEmailRegex
};
