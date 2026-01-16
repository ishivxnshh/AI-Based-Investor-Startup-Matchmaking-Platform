const TokenGenerator = require('../token_gen');

describe('TokenGenerator', () => {
  describe('Basic Generation', () => {
    test('should generate token with default length', () => {
      const token = TokenGenerator.generate();
      expect(token).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    test('should generate URL-safe token', () => {
      const token = TokenGenerator.generateUrlSafe();
      expect(token).not.toMatch(/[+/=]/);
    });

    test('should generate numeric token', () => {
      const token = TokenGenerator.generateNumeric(6);
      expect(token).toMatch(/^\d{6}$/);
    });

    test('should generate alphanumeric token', () => {
      const token = TokenGenerator.generateAlphanumeric(16);
      expect(token).toHaveLength(16);
      expect(token).toMatch(/^[A-Za-z0-9]+$/);
    });

    test('should generate UUID', () => {
      const uuid = TokenGenerator.generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Specialized Tokens', () => {
    test('should generate API key with prefix', () => {
      const key = TokenGenerator.generateAPIKey('sk', 24);
      expect(key).toMatch(/^sk_[a-f0-9]{48}$/);
    });

    test('should generate session token with expiration', () => {
      const session = TokenGenerator.generateSession({ expiresIn: 1000 });
      expect(session.token).toBeDefined();
      expect(session.isExpired()).toBe(false);
    });

    test('should generate OTP', () => {
      const otp = TokenGenerator.generateOTP(6);
      expect(otp).toHaveLength(6);
      expect(Number(otp)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Signing and Verification', () => {
    test('should sign and verify payload', () => {
      const payload = 'test-data';
      const secret = 'secret-key';
      const signed = TokenGenerator.sign(payload, secret);
      const verified = TokenGenerator.verifySignature(signed, secret);
      expect(verified).toBe(payload);
    });

    test('should fail with wrong secret', () => {
      const signed = TokenGenerator.sign('data', 'secret1');
      const verified = TokenGenerator.verifySignature(signed, 'secret2');
      expect(verified).toBe(null);
    });

    test('should hash and verify token', () => {
      const token = 'my-token';
      const hash = TokenGenerator.hash(token);
      expect(TokenGenerator.verify(token, hash)).toBe(true);
      expect(TokenGenerator.verify('wrong', hash)).toBe(false);
    });
  });

  describe('Batch Operations', () => {
    test('should generate batch of tokens', () => {
      const tokens = TokenGenerator.generateBatch(5, 16);
      expect(tokens).toHaveLength(5);
      tokens.forEach(token => expect(token).toHaveLength(32));
    });
  });

  describe('Token Analysis', () => {
    test('should analyze token strength', () => {
      const token = 'Abc123!@#';
      const analysis = TokenGenerator.analyzeStrength(token);
      expect(analysis.hasUpperCase).toBe(true);
      expect(analysis.hasLowerCase).toBe(true);
      expect(analysis.hasNumbers).toBe(true);
      expect(analysis.hasSpecialChars).toBe(true);
    });
  });
});
