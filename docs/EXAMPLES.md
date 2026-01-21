# Email Service Integration Examples

This document provides practical examples of using the EmailService in different scenarios throughout the application.

## Basic Usage

### Registration Endpoint

```javascript
import emailService from '../services/emailService.js';

router.post('/register', async (req, res) => {
  try {
    // Validate and normalize email
    const emailResult = emailService.processEmail(req.body.email);
    
    if (!emailResult.valid) {
      return res.status(400).json({
        success: false,
        error: emailResult.error
      });
    }

    const email = emailResult.normalized;

    // Check for duplicates (case-insensitive)
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Create user with normalized email
    const user = await User.create({
      email,
      fullName: req.body.fullName,
      password: req.body.password,
      role: req.body.role
    });

    logger.info(`New user registered: ${emailService.sanitizeForLogging(email)}`);
    res.status(201).json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
```

### Login Endpoint

```javascript
router.post('/login', async (req, res) => {
  try {
    // Normalize email for lookup
    const emailResult = emailService.processEmail(req.body.email);
    
    if (!emailResult.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const email = emailResult.normalized;

    // Find user (case-insensitive)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    }).select('+password');

    if (!user) {
      logger.warn(`Failed login attempt: ${emailService.sanitizeForLogging(email)}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(req.body.password);
    
    if (!isMatch) {
      logger.warn(`Wrong password: ${emailService.sanitizeForLogging(email)}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    logger.info(`User logged in: ${emailService.sanitizeForLogging(email)}`);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
```

## Advanced Usage

### Email Comparison

```javascript
// Check if two emails are the same (case-insensitive)
const isSameUser = emailService.areEmailsEqual(
  'user@example.com',
  'USER@EXAMPLE.COM'
); // returns true

// Use in middleware
const checkDuplicateEmail = async (req, res, next) => {
  const newEmail = req.body.email;
  const currentUser = await User.findById(req.user.id);

  if (!emailService.areEmailsEqual(newEmail, currentUser.email)) {
    // Email is changing, check if new email exists
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${newEmail}$`, 'i') }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already in use'
      });
    }
  }

  next();
};
```

### Domain Validation

```javascript
router.post('/register', async (req, res) => {
  const emailResult = emailService.processEmail(req.body.email);
  
  if (!emailResult.valid) {
    return res.status(400).json({ error: emailResult.error });
  }

  // Additional domain validation
  if (!emailService.hasValidDomain(req.body.email)) {
    return res.status(400).json({
      success: false,
      error: 'Email domain appears to be invalid'
    });
  }

  // Continue with registration...
});
```

### Sanitized Logging

```javascript
// Import emailService in logger configuration
import emailService from '../services/emailService.js';

// Safe logging wrapper
function logUserAction(action, email, details = {}) {
  logger.info(`${action}: ${emailService.sanitizeForLogging(email)}`, details);
}

// Usage in routes
logUserAction('User registered', email, { role: 'investor' });
logUserAction('Password reset requested', email);
logUserAction('Profile updated', email, { fields: ['fullName', 'bio'] });

// Output examples:
// "User registered: te***er@example.com { role: 'investor' }"
// "Password reset requested: jo***oe@gmail.com"
```

### Bulk Email Operations

```javascript
// Validate multiple emails
router.post('/invite-team', async (req, res) => {
  const { emails } = req.body; // Array of email strings

  // Get statistics
  const stats = emailService.getEmailStats(emails);

  if (stats.invalid > 0) {
    return res.status(400).json({
      success: false,
      error: `${stats.invalid} invalid email(s) found`,
      stats
    });
  }

  if (stats.duplicates > 0) {
    return res.status(400).json({
      success: false,
      error: `${stats.duplicates} duplicate email(s) found`,
      stats
    });
  }

  // Process valid unique emails
  const processedEmails = emails
    .map(email => emailService.processEmail(email))
    .filter(result => result.valid)
    .map(result => result.normalized);

  // Send invitations
  await sendBulkInvitations(processedEmails);

  res.json({
    success: true,
    message: `Invitations sent to ${processedEmails.length} users`,
    stats
  });
});
```

## Testing Examples

### Unit Tests

```javascript
import emailService from '../services/emailService.js';

describe('EmailService Integration', () => {
  describe('processEmail', () => {
    it('should normalize email for registration', () => {
      const result = emailService.processEmail('Test@Example.COM');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.com');
    });

    it('should reject invalid email', () => {
      const result = emailService.processEmail('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('areEmailsEqual', () => {
    it('should match emails case-insensitively', () => {
      expect(emailService.areEmailsEqual(
        'test@example.com',
        'TEST@EXAMPLE.COM'
      )).toBe(true);
    });
  });
});
```

### Integration Tests

```javascript
import request from 'supertest';
import app from '../index.js';
import emailService from '../services/emailService.js';

describe('Auth Integration with EmailService', () => {
  it('should block duplicate registration with different case', async () => {
    // Register first user
    const firstRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: 'investor'
      });

    expect(firstRes.status).toBe(201);

    // Try to register with uppercase email
    const secondRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'TEST@EXAMPLE.COM',
        password: 'password456',
        fullName: 'Test User 2',
        role: 'startup'
      });

    expect(secondRes.status).toBe(409);
    expect(secondRes.body.error).toContain('already exists');
  });

  it('should allow login with different case', async () => {
    // Register user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: 'investor'
      });

    // Login with uppercase email
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeTruthy();
  });
});
```

## Error Handling

### Graceful Degradation

```javascript
router.post('/register', async (req, res) => {
  let emailResult;
  
  try {
    // Try EmailService first
    emailResult = emailService.processEmail(req.body.email);
  } catch (error) {
    logger.error('EmailService error:', error);
    
    // Fallback to basic normalization
    try {
      const email = req.body.email.toLowerCase().trim();
      emailResult = { valid: true, normalized: email, error: null };
    } catch (fallbackError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email provided'
      });
    }
  }

  if (!emailResult.valid) {
    return res.status(400).json({
      success: false,
      error: emailResult.error
    });
  }

  // Continue with registration...
});
```

### Custom Error Messages

```javascript
function getEmailErrorMessage(emailResult) {
  if (emailResult.valid) return null;

  const errorMap = {
    'Invalid email provided': 'Please enter a valid email address',
    'Invalid email format': 'Email format is incorrect. Example: user@example.com',
    'Email domain appears to be invalid': 'The email domain does not appear to be valid'
  };

  return errorMap[emailResult.error] || 'Email validation failed';
}

// Usage
router.post('/register', async (req, res) => {
  const emailResult = emailService.processEmail(req.body.email);
  
  if (!emailResult.valid) {
    return res.status(400).json({
      success: false,
      error: getEmailErrorMessage(emailResult)
    });
  }
  // ...
});
```

## Middleware Examples

### Email Validation Middleware

```javascript
export const validateEmail = (req, res, next) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  const result = emailService.processEmail(email);

  if (!result.valid) {
    return res.status(400).json({
      success: false,
      error: result.error || 'Invalid email'
    });
  }

  // Attach normalized email to request
  req.normalizedEmail = result.normalized;
  next();
};

// Usage
router.post('/register', validateEmail, async (req, res) => {
  // Use req.normalizedEmail instead of req.body.email
  const email = req.normalizedEmail;
  // ...
});
```

### Email Domain Restriction Middleware

```javascript
const ALLOWED_DOMAINS = ['company.com', 'partner.com'];

export const restrictEmailDomains = (req, res, next) => {
  const email = req.normalizedEmail || req.body.email;
  const domain = email.split('@')[1]?.toLowerCase();

  if (!ALLOWED_DOMAINS.includes(domain)) {
    return res.status(403).json({
      success: false,
      error: `Only emails from ${ALLOWED_DOMAINS.join(', ')} are allowed`
    });
  }

  next();
};

// Usage
router.post('/admin/register', 
  validateEmail, 
  restrictEmailDomains, 
  async (req, res) => {
    // Only company emails allowed
  }
);
```

## Performance Optimization

### Caching Email Validation

```javascript
import NodeCache from 'node-cache';

const emailCache = new NodeCache({ stdTTL: 3600 }); // 1 hour

router.post('/register', async (req, res) => {
  const rawEmail = req.body.email;
  
  // Check cache first
  let emailResult = emailCache.get(rawEmail);
  
  if (!emailResult) {
    // Process and cache
    emailResult = emailService.processEmail(rawEmail);
    emailCache.set(rawEmail, emailResult);
  }

  if (!emailResult.valid) {
    return res.status(400).json({ error: emailResult.error });
  }

  // Continue with registration...
});
```

### Batch Processing

```javascript
async function processEmailBatch(emails) {
  const results = await Promise.all(
    emails.map(async email => {
      try {
        const result = emailService.processEmail(email);
        return { email, ...result };
      } catch (error) {
        return { email, valid: false, error: error.message };
      }
    })
  );

  return results;
}

// Usage
router.post('/bulk-invite', async (req, res) => {
  const { emails } = req.body;
  const results = await processEmailBatch(emails);
  
  const valid = results.filter(r => r.valid);
  const invalid = results.filter(r => !r.valid);

  res.json({
    success: true,
    processed: emails.length,
    valid: valid.length,
    invalid: invalid.length,
    invalidEmails: invalid.map(r => ({ email: r.email, error: r.error }))
  });
});
```

## Best Practices Summary

1. **Always use EmailService for user input**
   ```javascript
   const result = emailService.processEmail(req.body.email);
   ```

2. **Sanitize emails in logs**
   ```javascript
   logger.info(`Action: ${emailService.sanitizeForLogging(email)}`);
   ```

3. **Use case-insensitive queries**
   ```javascript
   User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
   ```

4. **Handle errors gracefully**
   ```javascript
   if (!result.valid) {
     return res.status(400).json({ error: result.error });
   }
   ```

5. **Validate domains when needed**
   ```javascript
   if (!emailService.hasValidDomain(email)) {
     return res.status(400).json({ error: 'Invalid domain' });
   }
   ```

## Migration from Old Code

### Before (Old Code)
```javascript
router.post('/register', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });
  // ...
});
```

### After (New Code)
```javascript
router.post('/register', async (req, res) => {
  const emailResult = emailService.processEmail(req.body.email);
  if (!emailResult.valid) {
    return res.status(400).json({ error: emailResult.error });
  }
  const email = emailResult.normalized;
  const user = await User.findOne({ 
    email: { $regex: new RegExp(`^${email}$`, 'i') } 
  });
  // ...
});
```

## References

- [EmailService API](./server/services/emailService.js)
- [EmailValidator Utilities](./server/utils/emailValidator.js)
- [Auth Routes Implementation](./server/routes/auth.js)
- [Security Documentation](./docs/EMAIL-SECURITY.md)
- [Migration Guide](./docs/MIGRATION-GUIDE.md)
