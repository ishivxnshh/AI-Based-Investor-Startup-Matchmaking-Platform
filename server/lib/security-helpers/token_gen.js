/**
 * Secure Token Generator
 * Generate cryptographically secure random tokens for authentication and sessions
 */

const crypto = require('crypto');

class TokenGenerator {
  /**
   * Generate a random token
   * @param {number} length - Length of token in bytes (default: 32)
   * @param {string} encoding - Encoding format (default: 'hex')
   * @returns {string} - Generated token
   */
  static generate(length = 32, encoding = 'hex') {
    return crypto.randomBytes(length).toString(encoding);
  }

  /**
   * Generate a URL-safe token
   * @param {number} length - Length of token in bytes (default: 32)
   * @returns {string} - URL-safe token
   */
  static generateUrlSafe(length = 32) {
    return crypto.randomBytes(length)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate a numeric token
   * @param {number} digits - Number of digits (default: 6)
   * @returns {string} - Numeric token
   */
  static generateNumeric(digits = 6) {
    const max = Math.pow(10, digits);
    const num = crypto.randomInt(0, max);
    return num.toString().padStart(digits, '0');
  }

  /**
   * Generate an alphanumeric token
   * @param {number} length - Length of token (default: 16)
   * @returns {string} - Alphanumeric token
   */
  static generateAlphanumeric(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const bytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      token += chars[bytes[i] % chars.length];
    }
    
    return token;
  }

  /**
   * Generate a token with custom character set
   * @param {number} length - Length of token
   * @param {string} charset - Character set to use
   * @returns {string} - Generated token
   */
  static generateCustom(length, charset) {
    if (!charset || charset.length === 0) {
      throw new Error('Charset must not be empty');
    }
    
    let token = '';
    const bytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      token += charset[bytes[i] % charset.length];
    }
    
    return token;
  }

  /**
   * Generate a UUID v4
   * @returns {string} - UUID
   */
  static generateUUID() {
    return crypto.randomUUID();
  }

  /**
   * Generate a session token with metadata
   * @param {Object} options - Token options
   * @param {number} options.length - Token length in bytes
   * @param {number} options.expiresIn - Expiration time in milliseconds
   * @returns {Object} - Token object with metadata
   */
  static generateSession(options = {}) {
    const {
      length = 32,
      expiresIn = 3600000 // 1 hour
    } = options;

    const token = this.generate(length);
    const createdAt = Date.now();
    const expiresAt = createdAt + expiresIn;

    return {
      token,
      createdAt,
      expiresAt,
      isExpired() {
        return Date.now() > this.expiresAt;
      }
    };
  }

  /**
   * Generate an API key
   * @param {string} prefix - Prefix for the key (default: 'sk')
   * @param {number} length - Length of random part in bytes (default: 24)
   * @returns {string} - API key
   */
  static generateAPIKey(prefix = 'sk', length = 24) {
    const randomPart = this.generate(length, 'hex');
    return `${prefix}_${randomPart}`;
  }

  /**
   * Generate a refresh token
   * @param {number} length - Length in bytes (default: 48)
   * @returns {string} - Refresh token
   */
  static generateRefreshToken(length = 48) {
    return this.generateUrlSafe(length);
  }

  /**
   * Generate a CSRF token
   * @param {number} length - Length in bytes (default: 32)
   * @returns {string} - CSRF token
   */
  static generateCSRFToken(length = 32) {
    return this.generateUrlSafe(length);
  }

  /**
   * Generate a one-time password (OTP)
   * @param {number} digits - Number of digits (default: 6)
   * @returns {string} - OTP
   */
  static generateOTP(digits = 6) {
    return this.generateNumeric(digits);
  }

  /**
   * Generate a reset token with expiration
   * @param {Object} options - Options
   * @param {number} options.length - Token length in bytes
   * @param {number} options.expiresIn - Expiration time in milliseconds
   * @returns {Object} - Reset token object
   */
  static generateResetToken(options = {}) {
    const {
      length = 32,
      expiresIn = 3600000 // 1 hour
    } = options;

    return this.generateSession({ length, expiresIn });
  }

  /**
   * Generate a verification code
   * @param {number} length - Length of code (default: 8)
   * @returns {string} - Verification code
   */
  static generateVerificationCode(length = 8) {
    return this.generateAlphanumeric(length).toUpperCase();
  }

  /**
   * Hash a token using SHA-256
   * @param {string} token - Token to hash
   * @returns {string} - Hashed token
   */
  static hash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify a token against its hash
   * @param {string} token - Token to verify
   * @param {string} hash - Hash to compare against
   * @returns {boolean} - True if token matches hash
   */
  static verify(token, hash) {
    const tokenHash = this.hash(token);
    return crypto.timingSafeEqual(
      Buffer.from(tokenHash),
      Buffer.from(hash)
    );
  }

  /**
   * Generate a signed token
   * @param {string} payload - Payload to sign
   * @param {string} secret - Secret key
   * @returns {string} - Signed token
   */
  static sign(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const signature = hmac.digest('hex');
    return `${payload}.${signature}`;
  }

  /**
   * Verify a signed token
   * @param {string} signedToken - Signed token
   * @param {string} secret - Secret key
   * @returns {string|null} - Payload if valid, null otherwise
   */
  static verifySignature(signedToken, secret) {
    const parts = signedToken.split('.');
    if (parts.length !== 2) return null;

    const [payload, signature] = parts;
    const expectedSigned = this.sign(payload, secret);
    const expectedSignature = expectedSigned.split('.')[1];

    try {
      if (crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )) {
        return payload;
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  /**
   * Generate multiple tokens at once
   * @param {number} count - Number of tokens to generate
   * @param {number} length - Length of each token
   * @returns {Array<string>} - Array of tokens
   */
  static generateBatch(count, length = 32) {
    return Array.from({ length: count }, () => this.generate(length));
  }

  /**
   * Check token strength
   * @param {string} token - Token to check
   * @returns {Object} - Strength analysis
   */
  static analyzeStrength(token) {
    const length = token.length;
    const hasUpperCase = /[A-Z]/.test(token);
    const hasLowerCase = /[a-z]/.test(token);
    const hasNumbers = /[0-9]/.test(token);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(token);

    const charsetSize = 
      (hasUpperCase ? 26 : 0) +
      (hasLowerCase ? 26 : 0) +
      (hasNumbers ? 10 : 0) +
      (hasSpecialChars ? 32 : 0);

    const entropy = length * Math.log2(charsetSize || 1);

    let strength = 'weak';
    if (entropy >= 128) strength = 'very strong';
    else if (entropy >= 80) strength = 'strong';
    else if (entropy >= 60) strength = 'moderate';

    return {
      length,
      entropy: entropy.toFixed(2),
      strength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars
    };
  }
}

module.exports = TokenGenerator;
