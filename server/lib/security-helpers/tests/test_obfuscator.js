const Obfuscator = require('../obfuscator');

describe('Obfuscator', () => {
  describe('Email Obfuscation', () => {
    test('should obfuscate email', () => {
      expect(Obfuscator.email('john.doe@example.com')).toBe('jo***oe@example.com');
      expect(Obfuscator.email('a@example.com')).toBe('a***@example.com');
    });

    test('should handle invalid email', () => {
      expect(Obfuscator.email('notanemail')).toBe('***');
    });
  });

  describe('Phone Obfuscation', () => {
    test('should obfuscate phone number', () => {
      expect(Obfuscator.phone('555-123-4567')).toBe('*******4567');
      expect(Obfuscator.phone('(555) 123-4567')).toBe('*******4567');
    });
  });

  describe('Credit Card Obfuscation', () => {
    test('should obfuscate credit card', () => {
      expect(Obfuscator.creditCard('4532-1234-5678-9010')).toBe('**** **** **** 9010');
      expect(Obfuscator.creditCard('4532123456789010')).toBe('**** **** **** 9010');
    });
  });

  describe('SSN Obfuscation', () => {
    test('should obfuscate SSN', () => {
      expect(Obfuscator.ssn('123-45-6789')).toBe('***-**-6789');
    });
  });

  describe('IP Address Obfuscation', () => {
    test('should obfuscate IPv4', () => {
      expect(Obfuscator.ip('192.168.1.1')).toBe('192.168.***.***');
    });

    test('should obfuscate IPv6', () => {
      expect(Obfuscator.ip('2001:0db8:85a3')).toContain('****');
    });
  });

  describe('Name Obfuscation', () => {
    test('should obfuscate name', () => {
      expect(Obfuscator.name('John Doe')).toBe('J*** D**');
      expect(Obfuscator.name('Alice')).toBe('A****');
    });
  });

  describe('Custom Obfuscation', () => {
    test('should obfuscate with custom options', () => {
      const result = Obfuscator.custom('sensitive', {
        visibleStart: 1,
        visibleEnd: 1,
        maskChar: '#'
      });
      expect(result).toBe('s#######e');
    });
  });

  describe('Obfuscate All', () => {
    test('should obfuscate all PII in text', () => {
      const text = 'Contact john@example.com or 555-123-4567';
      const result = Obfuscator.all(text);
      expect(result).toContain('***');
      expect(result).not.toContain('john@example.com');
    });
  });

  describe('Object Obfuscation', () => {
    test('should obfuscate object fields', () => {
      const obj = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-123-4567'
      };
      const result = Obfuscator.object(obj, ['email', 'phone'], {
        email: 'email',
        phone: 'phone'
      });
      expect(result.email).not.toBe('john@example.com');
      expect(result.phone).not.toBe('555-123-4567');
      expect(result.name).toBe('John Doe');
    });
  });

  describe('PII Detection', () => {
    test('should detect PII in text', () => {
      const text = 'Email: test@example.com Phone: 555-123-4567';
      const detection = Obfuscator.detectPII(text);
      expect(detection.hasEmail).toBe(true);
      expect(detection.hasPhone).toBe(true);
    });
  });

  describe('Reversible Obfuscation', () => {
    test('should create reversible obfuscation', () => {
      const text = 'secret';
      const obf = Obfuscator.reversible(text, 'key');
      const deobf = Obfuscator.deobfuscate(obf, 'key');
      expect(deobf).toBe(text);
    });
  });

  describe('Statistics', () => {
    test('should provide obfuscation stats', () => {
      const original = 'test@example.com';
      const obfuscated = Obfuscator.email(original);
      const stats = Obfuscator.stats(original, obfuscated);
      expect(stats.maskedChars).toBeGreaterThan(0);
    });
  });
});
