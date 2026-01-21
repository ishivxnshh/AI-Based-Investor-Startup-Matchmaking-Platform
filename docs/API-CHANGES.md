# API Documentation Update: Email Handling

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "startup" | "investor"
}
```

**Email Normalization (NEW):**
- All emails are automatically converted to lowercase
- Whitespace is trimmed from both ends
- Case-insensitive duplicate checking is performed

**Example:**
```javascript
// These are all treated as the same email:
"user@example.com"
"USER@EXAMPLE.COM"
"  User@Example.COM  "
// Result: stored as "user@example.com"
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "user@example.com",  // Always lowercase
    "role": "startup",
    "createdAt": "2026-01-21T10:00:00.000Z"
  }
}
```

**Error Response (409 - Duplicate Email):**
```json
{
  "success": false,
  "error": "User already exists with this email"
}
```

**Note:** This error is now returned for emails that match in a case-insensitive manner.

---

### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Email Handling (UPDATED):**
- Email matching is case-insensitive
- You can login with any case variation of your registered email

**Example:**
```javascript
// If registered as: "user@example.com"
// Can login with any of these:
"user@example.com"
"USER@EXAMPLE.COM"
"User@Example.COM"
// All will authenticate successfully
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "startup"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

## Breaking Changes
**None** - This is a backward-compatible security improvement.

Existing users can continue to login with their email in any case. The only change is that new registrations with case-variant emails will be properly rejected.

---

## Migration Notes

### For Existing Systems
If you have existing duplicate accounts from before this fix:

1. **Identify Duplicates:**
```javascript
db.users.aggregate([
  {
    $group: {
      _id: { $toLower: "$email" },
      count: { $sum: 1 },
      emails: { $push: "$email" }
    }
  },
  {
    $match: { count: { $gt: 1 } }
  }
])
```

2. **Manual Resolution:**
Contact users to determine which account to keep, then merge or delete duplicates.

---

## Best Practices

### Client-Side
```javascript
// Always send emails in lowercase
const email = userInput.toLowerCase().trim();

fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email,  // Pre-normalized
    // other fields...
  })
});
```

### Email Display
```javascript
// Display as entered by user
<input type="email" value={originalEmail} />

// But submit normalized version
const submitEmail = originalEmail.toLowerCase().trim();
```

---

## Security Considerations

1. **Email Privacy**: Emails are case-insensitive per RFC 5321
2. **Unicode**: ASCII emails only (no internationalized domains yet)
3. **Validation**: Format validation happens before normalization
4. **Storage**: All emails stored in lowercase for consistency

---

## Testing Examples

```javascript
// Register tests
POST /api/auth/register
Body: { email: "TEST@EXAMPLE.COM", ... }
✅ Stores as: "test@example.com"

POST /api/auth/register  
Body: { email: "test@example.com", ... }
❌ Error: User already exists

// Login tests
POST /api/auth/login
Body: { email: "TeSt@ExAmPlE.CoM", ... }
✅ Login successful
```

---

## Support
For questions or issues, please refer to:
- [Bug Fix Report](../BUG-FIX-REPORT.md)
- [Security Advisory](SECURITY-ADVISORY.md)
- [Testing Strategy](TESTING-STRATEGY.md)
