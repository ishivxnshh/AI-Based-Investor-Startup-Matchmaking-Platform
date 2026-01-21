// Email validation middleware for Express routes
import emailService from '../services/emailService.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware to validate email in request body
 * Attaches normalized email to req.normalizedEmail
 */
export const validateEmail = (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    logger.warn('Email validation failed: Email is required');
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  const result = emailService.processEmail(email);

  if (!result.valid) {
    logger.warn(`Email validation failed: ${result.error}`);
    return res.status(400).json({
      success: false,
      error: result.error || 'Invalid email format'
    });
  }

  // Attach normalized email to request for downstream handlers
  req.normalizedEmail = result.normalized;
  logger.debug(`Email validated: ${emailService.sanitizeForLogging(result.normalized)}`);
  
  next();
};

/**
 * Middleware to check for duplicate email in database
 * Requires validateEmail middleware to run first
 */
export const checkDuplicateEmail = (Model) => {
  return async (req, res, next) => {
    const email = req.normalizedEmail || req.body.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    try {
      // Case-insensitive duplicate check
      const existing = await Model.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') }
      });

      if (existing) {
        logger.warn(`Duplicate email attempt: ${emailService.sanitizeForLogging(email)}`);
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      }

      next();
    } catch (error) {
      logger.error(`Database error in checkDuplicateEmail: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: 'Server error'
      });
    }
  };
};

/**
 * Middleware to restrict email to specific domains
 */
export const restrictEmailDomains = (allowedDomains) => {
  return (req, res, next) => {
    const email = req.normalizedEmail || req.body.email;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const domain = email.split('@')[1]?.toLowerCase();

    if (!allowedDomains.includes(domain)) {
      logger.warn(`Restricted domain attempt: ${emailService.sanitizeForLogging(email)}`);
      return res.status(403).json({
        success: false,
        error: `Only emails from ${allowedDomains.join(', ')} are allowed`
      });
    }

    next();
  };
};

/**
 * Middleware to validate email domain has valid structure
 */
export const validateEmailDomain = (req, res, next) => {
  const email = req.normalizedEmail || req.body.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  if (!emailService.hasValidDomain(email)) {
    logger.warn(`Invalid domain: ${emailService.sanitizeForLogging(email)}`);
    return res.status(400).json({
      success: false,
      error: 'Email domain appears to be invalid'
    });
  }

  next();
};

export default {
  validateEmail,
  checkDuplicateEmail,
  restrictEmailDomains,
  validateEmailDomain
};
