// Email constants and configuration
export const EMAIL_CONFIG = {
  // Maximum email length (RFC 5321)
  MAX_LENGTH: 254,
  
  // Maximum local part length (before @)
  MAX_LOCAL_LENGTH: 64,
  
  // Maximum domain length (after @)
  MAX_DOMAIN_LENGTH: 253,
  
  // Minimum TLD length
  MIN_TLD_LENGTH: 2,
  
  // Blacklisted domains (disposable email services)
  BLACKLISTED_DOMAINS: [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'fakeinbox.com'
  ],
  
  // Whitelisted domains (for enterprise use)
  WHITELISTED_DOMAINS: [],
  
  // Email regex pattern (RFC 5322 compliant)
  EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
};

// Error messages
export const EMAIL_ERRORS = {
  REQUIRED: 'Email is required',
  INVALID_FORMAT: 'Invalid email format',
  TOO_LONG: `Email exceeds maximum length of ${EMAIL_CONFIG.MAX_LENGTH} characters`,
  DOMAIN_BLACKLISTED: 'This email domain is not allowed',
  DOMAIN_INVALID: 'Email domain appears to be invalid',
  DUPLICATE: 'Email already exists',
  LOCAL_PART_TOO_LONG: `Email local part exceeds maximum length of ${EMAIL_CONFIG.MAX_LOCAL_LENGTH} characters`,
  DOMAIN_TOO_LONG: `Email domain exceeds maximum length of ${EMAIL_CONFIG.MAX_DOMAIN_LENGTH} characters`
};

// Success messages
export const EMAIL_SUCCESS = {
  VALIDATED: 'Email validated successfully',
  NORMALIZED: 'Email normalized successfully',
  UNIQUE: 'Email is unique'
};

// Logging prefixes
export const EMAIL_LOG_PREFIX = {
  VALIDATION: '[EmailValidation]',
  NORMALIZATION: '[EmailNormalization]',
  DUPLICATE_CHECK: '[DuplicateCheck]',
  SECURITY: '[EmailSecurity]'
};

export default {
  EMAIL_CONFIG,
  EMAIL_ERRORS,
  EMAIL_SUCCESS,
  EMAIL_LOG_PREFIX
};
