// Email Service - Centralized email handling for authentication
// This service provides consistent email processing across all auth endpoints

import { normalizeEmail, isValidEmail, emailsMatch } from '../utils/emailValidator.js';
import logger from '../utils/logger.js';

/**
 * Email Service for handling all email-related operations
 * Provides consistent email validation, normalization, and comparison
 */
class EmailService {
  /**
   * Validate and normalize an email address
   * @param {string} email - Raw email input
   * @returns {Object} - {valid: boolean, normalized: string|null, error: string|null}
   */
  processEmail(email) {
    try {
      // Validate format
      if (!isValidEmail(email)) {
        return {
          valid: false,
          normalized: null,
          error: 'Invalid email format'
        };
      }

      // Normalize
      const normalized = normalizeEmail(email);
      
      logger.info(`Email processed successfully: ${normalized}`);
      
      return {
        valid: true,
        normalized,
        error: null
      };
    } catch (error) {
      logger.error(`Email processing error: ${error.message}`);
      return {
        valid: false,
        normalized: null,
        error: error.message
      };
    }
  }

  /**
   * Check if two emails are equivalent (case-insensitive)
   * @param {string} email1 - First email
   * @param {string} email2 - Second email
   * @returns {boolean} - True if emails match
   */
  areEmailsEqual(email1, email2) {
    try {
      return emailsMatch(email1, email2);
    } catch (error) {
      logger.error(`Email comparison error: ${error.message}`);
      return false;
    }
  }

  /**
   * Sanitize email for logging (mask middle part)
   * @param {string} email - Email to sanitize
   * @returns {string} - Sanitized email for logs
   */
  sanitizeForLogging(email) {
    if (!email || typeof email !== 'string') {
      return '[INVALID_EMAIL]';
    }

    const [local, domain] = email.split('@');
    if (!local || !domain) {
      return '[MALFORMED_EMAIL]';
    }

    // Show first 2 chars and last 2 chars of local part
    if (local.length <= 4) {
      return `${local[0]}***@${domain}`;
    }

    const start = local.substring(0, 2);
    const end = local.substring(local.length - 2);
    return `${start}***${end}@${domain}`;
  }

  /**
   * Validate email domain exists (basic check)
   * @param {string} email - Email to validate
   * @returns {boolean} - True if domain appears valid
   */
  hasValidDomain(email) {
    try {
      const normalized = normalizeEmail(email);
      const [, domain] = normalized.split('@');
      
      // Basic domain validation
      if (!domain || domain.length < 3) {
        return false;
      }

      // Check for at least one dot
      if (!domain.includes('.')) {
        return false;
      }

      // Check TLD length (at least 2 chars)
      const tld = domain.split('.').pop();
      if (!tld || tld.length < 2) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get email statistics for monitoring
   * @param {Array} emails - Array of email strings
   * @returns {Object} - Statistics about the emails
   */
  getEmailStats(emails) {
    if (!Array.isArray(emails)) {
      return { total: 0, valid: 0, invalid: 0, unique: 0 };
    }

    const valid = emails.filter(e => isValidEmail(e));
    const normalized = valid.map(e => normalizeEmail(e));
    const unique = new Set(normalized);

    return {
      total: emails.length,
      valid: valid.length,
      invalid: emails.length - valid.length,
      unique: unique.size,
      duplicates: valid.length - unique.size
    };
  }
}

// Export singleton instance
export default new EmailService();
