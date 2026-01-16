/**
 * PII Obfuscator
 * Mask and obfuscate personally identifiable information in strings
 */

class Obfuscator {
  /**
   * Obfuscate an email address
   * @param {string} email - Email to obfuscate
   * @param {Object} options - Obfuscation options
   * @param {number} options.visibleStart - Characters visible at start (default: 2)
   * @param {number} options.visibleEnd - Characters visible at end (default: 2)
   * @returns {string} - Obfuscated email
   */
  static email(email, options = {}) {
    const { visibleStart = 2, visibleEnd = 2 } = options;
    
    if (!email || !email.includes('@')) {
      return '***';
    }

    const [localPart, domain] = email.split('@');
    
    if (localPart.length <= visibleStart + visibleEnd) {
      return `${localPart[0]}***@${domain}`;
    }

    const start = localPart.slice(0, visibleStart);
    const end = localPart.slice(-visibleEnd);
    const masked = `${start}***${end}`;

    return `${masked}@${domain}`;
  }

  /**
   * Obfuscate a phone number
   * @param {string} phone - Phone number to obfuscate
   * @param {Object} options - Obfuscation options
   * @param {number} options.visibleEnd - Digits visible at end (default: 4)
   * @returns {string} - Obfuscated phone
   */
  static phone(phone, options = {}) {
    const { visibleEnd = 4 } = options;
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length <= visibleEnd) {
      return '***';
    }

    const masked = '*'.repeat(digits.length - visibleEnd);
    const visible = digits.slice(-visibleEnd);
    
    return `${masked}${visible}`;
  }

  /**
   * Obfuscate a credit card number
   * @param {string} cardNumber - Card number to obfuscate
   * @returns {string} - Obfuscated card number (shows last 4 digits)
   */
  static creditCard(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 12) {
      return '****';
    }

    const lastFour = digits.slice(-4);
    return `**** **** **** ${lastFour}`;
  }

  /**
   * Obfuscate a Social Security Number
   * @param {string} ssn - SSN to obfuscate
   * @returns {string} - Obfuscated SSN (shows last 4 digits)
   */
  static ssn(ssn) {
    const digits = ssn.replace(/\D/g, '');
    
    if (digits.length !== 9) {
      return '***-**-****';
    }

    const lastFour = digits.slice(-4);
    return `***-**-${lastFour}`;
  }

  /**
   * Obfuscate an IP address
   * @param {string} ip - IP address to obfuscate
   * @returns {string} - Obfuscated IP
   */
  static ip(ip) {
    // IPv4
    if (ip.includes('.')) {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.***.**`;
      }
    }
    
    // IPv6
    if (ip.includes(':')) {
      const parts = ip.split(':');
      if (parts.length >= 3) {
        return `${parts[0]}:${parts[1]}:****:****`;
      }
    }

    return '***';
  }

  /**
   * Obfuscate a name
   * @param {string} name - Name to obfuscate
   * @param {Object} options - Options
   * @param {boolean} options.keepFirst - Keep first letter visible (default: true)
   * @returns {string} - Obfuscated name
   */
  static name(name, options = {}) {
    const { keepFirst = true } = options;
    
    const parts = name.trim().split(/\s+/);
    
    return parts.map(part => {
      if (part.length === 0) return '';
      if (part.length === 1) return keepFirst ? part : '*';
      
      if (keepFirst) {
        return part[0] + '*'.repeat(part.length - 1);
      } else {
        return '*'.repeat(part.length);
      }
    }).join(' ');
  }

  /**
   * Obfuscate an address
   * @param {string} address - Address to obfuscate
   * @returns {string} - Obfuscated address
   */
  static address(address) {
    const parts = address.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
      // Keep city and state/zip visible
      const lastPart = parts[parts.length - 1];
      return `*** ${parts.slice(-1).join(', ')}`;
    }

    return '***';
  }

  /**
   * Obfuscate a custom string
   * @param {string} text - Text to obfuscate
   * @param {Object} options - Options
   * @param {number} options.visibleStart - Characters visible at start
   * @param {number} options.visibleEnd - Characters visible at end
   * @param {string} options.maskChar - Character to use for masking (default: '*')
   * @returns {string} - Obfuscated text
   */
  static custom(text, options = {}) {
    const {
      visibleStart = 0,
      visibleEnd = 0,
      maskChar = '*'
    } = options;

    if (!text || text.length <= visibleStart + visibleEnd) {
      return maskChar.repeat(3);
    }

    const start = text.slice(0, visibleStart);
    const end = text.slice(-visibleEnd);
    const maskedLength = text.length - visibleStart - visibleEnd;
    const masked = maskChar.repeat(Math.max(maskedLength, 3));

    return `${start}${masked}${end}`;
  }

  /**
   * Obfuscate all PII in a string
   * @param {string} text - Text containing PII
   * @returns {string} - Text with PII obfuscated
   */
  static all(text) {
    let result = text;

    // Email pattern
    result = result.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      (match) => this.email(match)
    );

    // Phone pattern (various formats)
    result = result.replace(
      /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/g,
      (match) => this.phone(match)
    );

    // Credit card pattern
    result = result.replace(
      /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      (match) => this.creditCard(match)
    );

    // SSN pattern
    result = result.replace(
      /\b\d{3}-\d{2}-\d{4}\b/g,
      (match) => this.ssn(match)
    );

    // IP address pattern
    result = result.replace(
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      (match) => this.ip(match)
    );

    return result;
  }

  /**
   * Obfuscate an object's PII fields
   * @param {Object} obj - Object containing PII
   * @param {Array<string>} fields - Fields to obfuscate
   * @param {Object} types - Map of field names to obfuscation types
   * @returns {Object} - Object with obfuscated fields
   */
  static object(obj, fields, types = {}) {
    const result = { ...obj };

    for (const field of fields) {
      if (result[field]) {
        const type = types[field] || 'custom';
        
        if (typeof this[type] === 'function') {
          result[field] = this[type](result[field]);
        } else {
          result[field] = this.custom(result[field]);
        }
      }
    }

    return result;
  }

  /**
   * Create a reversible obfuscation (for testing/debugging)
   * @param {string} text - Text to obfuscate
   * @param {string} key - Key for obfuscation
   * @returns {string} - Obfuscated text (base64 encoded)
   */
  static reversible(text, key) {
    const encoded = Buffer.from(text).toString('base64');
    return `REV_${encoded}`;
  }

  /**
   * Reverse a reversible obfuscation
   * @param {string} obfuscated - Obfuscated text
   * @param {string} key - Key for deobfuscation
   * @returns {string|null} - Original text or null if invalid
   */
  static deobfuscate(obfuscated, key) {
    if (!obfuscated.startsWith('REV_')) {
      return null;
    }

    try {
      const encoded = obfuscated.slice(4);
      return Buffer.from(encoded, 'base64').toString('utf8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Get obfuscation statistics
   * @param {string} original - Original text
   * @param {string} obfuscated - Obfuscated text
   * @returns {Object} - Statistics
   */
  static stats(original, obfuscated) {
    const visibleChars = obfuscated.replace(/[*]/g, '').length;
    const maskedChars = (obfuscated.match(/\*/g) || []).length;
    const percentMasked = ((maskedChars / original.length) * 100).toFixed(2);

    return {
      originalLength: original.length,
      obfuscatedLength: obfuscated.length,
      visibleChars,
      maskedChars,
      percentMasked: percentMasked + '%'
    };
  }

  /**
   * Validate if a string contains PII
   * @param {string} text - Text to check
   * @returns {Object} - Detection results
   */
  static detectPII(text) {
    return {
      hasEmail: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text),
      hasPhone: /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/.test(text),
      hasCreditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/.test(text),
      hasSSN: /\b\d{3}-\d{2}-\d{4}\b/.test(text),
      hasIP: /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(text)
    };
  }
}

module.exports = Obfuscator;
