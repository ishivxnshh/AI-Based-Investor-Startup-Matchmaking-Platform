# Security & Cryptography Helpers

Comprehensive security utilities for token generation, PII obfuscation, and permission management.

## Features

### Token Generator
Generate cryptographically secure tokens for various use cases.

**Usage:**
```javascript
const { TokenGenerator } = require('./lib/security-helpers');

// Basic token
const token = TokenGenerator.generate(32); // 64-char hex string

// URL-safe token
const urlToken = TokenGenerator.generateUrlSafe(32);

// Numeric OTP
const otp = TokenGenerator.generateOTP(6); // 6-digit code

// API key
const apiKey = TokenGenerator.generateAPIKey('sk', 24);

// Session token with expiration
const session = TokenGenerator.generateSession({
  length: 32,
  expiresIn: 3600000 // 1 hour
});
console.log(session.isExpired()); // false

// Sign and verify
const payload = 'user:123';
const signed = TokenGenerator.sign(payload, 'secret');
const verified = TokenGenerator.verifySignature(signed, 'secret');
```

**Methods:**
- `generate(length, encoding)` - Basic random token
- `generateUrlSafe(length)` - URL-safe token
- `generateNumeric(digits)` - Numeric token
- `generateAlphanumeric(length)` - Alphanumeric token
- `generateUUID()` - UUID v4
- `generateAPIKey(prefix, length)` - API key with prefix
- `generateOTP(digits)` - One-time password
- `sign(payload, secret)` - Sign a payload
- `verifySignature(signed, secret)` - Verify signature

### Obfuscator
Mask and obfuscate personally identifiable information.

**Usage:**
```javascript
const { Obfuscator } = require('./lib/security-helpers');

// Email obfuscation
Obfuscator.email('john.doe@example.com'); // 'jo***oe@example.com'

// Phone obfuscation
Obfuscator.phone('555-123-4567'); // '*******4567'

// Credit card
Obfuscator.creditCard('4532-1234-5678-9010'); // '**** **** **** 9010'

// SSN
Obfuscator.ssn('123-45-6789'); // '***-**-6789'

// Name
Obfuscator.name('John Doe'); // 'J*** D**'

// Auto-detect and obfuscate all PII
const text = 'Contact john@example.com or 555-123-4567';
Obfuscator.all(text); // 'Contact jo**@example.com or *******4567'

// Obfuscate object fields
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-123-4567'
};
Obfuscator.object(user, ['email', 'phone'], {
  email: 'email',
  phone: 'phone'
});
```

### Permission Checker
Role-based access control system with caching.

**Usage:**
```javascript
const { PermissionChecker } = require('./lib/security-helpers');

const checker = new PermissionChecker();

// Define custom role
checker.addRole('editor', ['read', 'write', 'post.edit']);

// Assign roles to users
checker.assignRole('user123', 'editor');

// Check permissions
checker.hasPermission('user123', 'write'); // true
checker.hasPermission('user123', 'delete'); // false

// Check multiple permissions
checker.hasAllPermissions('user123', ['read', 'write']); // true
checker.hasAnyPermission('user123', ['delete', 'admin']); // false

// Express middleware
app.post('/api/posts', 
  checker.middleware(['write', 'post.create']),
  (req, res) => {
    // Handler
  }
);

// Role-based middleware
app.get('/admin', 
  checker.roleMiddleware('admin'),
  (req, res) => {
    // Admin handler
  }
);
```

## Use Cases

- **Token Generator**: Session management, API keys, password reset tokens, OTPs, CSRF tokens
- **Obfuscator**: Logging, displaying sensitive data, GDPR compliance, data privacy
- **Permission Checker**: RBAC, API protection, feature flags, multi-tenant systems

## Testing

Run tests with:
```bash
npm test -- server/lib/security-helpers/tests/
```

## Security Best Practices

1. **Never log unobfuscated PII**
2. **Always use HTTPS for token transmission**
3. **Store token hashes, not plain tokens**
4. **Implement token expiration**
5. **Use timing-safe comparison for tokens**
6. **Regularly rotate API keys**
7. **Implement rate limiting with tokens**

## Integration Example

```javascript
const { TokenGenerator, Obfuscator, PermissionChecker } = require('./lib/security-helpers');

// Generate session token
const session = TokenGenerator.generateSession({ expiresIn: 3600000 });

// Log with obfuscated data
console.log(`User ${Obfuscator.email(user.email)} logged in`);

// Check permissions
if (checker.hasPermission(userId, 'admin')) {
  // Allow admin action
}
```
