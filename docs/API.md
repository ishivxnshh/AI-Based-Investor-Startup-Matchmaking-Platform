# VentureBridge API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Users](#users-endpoints)
3. [Startups](#startups-endpoints)
4. [Investors](#investors-endpoints)
5. [Matches](#matches-endpoints)
6. [Chat](#chat-endpoints)
7. [AI Features](#ai-features-endpoints)
8. [File Upload](#file-upload-endpoints)
9. [Notifications](#notifications-endpoints)
10. [Error Responses](#error-responses)

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "startup" // or "investor"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "startup"
  }
}
```

### Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "startup"
  }
}
```

### Logout
**POST** `/api/auth/logout`

Logout current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User
**GET** `/api/auth/me`

Get currently authenticated user details.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "startup",
    "createdAt": "2026-01-21T10:00:00.000Z"
  }
}
```

---

## Users Endpoints

### Get User Profile
**GET** `/api/users/:id`

Get user profile by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "startup",
    "profile": {},
    "createdAt": "2026-01-21T10:00:00.000Z"
  }
}
```

### Update User Profile
**PUT** `/api/users/:id`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "bio": "Experienced entrepreneur"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890",
    "bio": "Experienced entrepreneur"
  }
}
```

### Delete User
**DELETE** `/api/users/:id`

Delete user account.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Startups Endpoints

### Create Startup Profile
**POST** `/api/startups`

Create a new startup profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "companyName": "TechStartup Inc",
  "industry": "Technology",
  "fundingStage": "Seed",
  "fundingAmount": 500000,
  "description": "AI-powered solutions",
  "location": "San Francisco, CA",
  "website": "https://techstartup.com",
  "teamSize": 5,
  "founded": "2025-01-01"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "startup": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "companyName": "TechStartup Inc",
    "industry": "Technology",
    "fundingStage": "Seed",
    "fundingAmount": 500000,
    "description": "AI-powered solutions",
    "location": "San Francisco, CA",
    "createdAt": "2026-01-21T10:00:00.000Z"
  }
}
```

### Get All Startups
**GET** `/api/startups`

Get list of all startups with optional filters.

**Query Parameters:**
- `industry` - Filter by industry
- `fundingStage` - Filter by funding stage
- `location` - Filter by location
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  },
  "startups": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "companyName": "TechStartup Inc",
      "industry": "Technology",
      "fundingStage": "Seed",
      "fundingAmount": 500000
    }
  ]
}
```

### Get Startup by ID
**GET** `/api/startups/:id`

Get detailed information about a specific startup.

**Response:** `200 OK`
```json
{
  "success": true,
  "startup": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "companyName": "TechStartup Inc",
    "industry": "Technology",
    "fundingStage": "Seed",
    "fundingAmount": 500000,
    "description": "AI-powered solutions",
    "location": "San Francisco, CA",
    "pitchDeck": "uploads/pitch-deck.pdf",
    "createdAt": "2026-01-21T10:00:00.000Z"
  }
}
```

### Update Startup
**PUT** `/api/startups/:id`

Update startup profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Any startup fields to update)

**Response:** `200 OK`

### Delete Startup
**DELETE** `/api/startups/:id`

Delete startup profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Investors Endpoints

### Create Investor Profile
**POST** `/api/investors`

Create a new investor profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Investor",
  "investmentRange": {
    "min": 100000,
    "max": 1000000
  },
  "industries": ["Technology", "Healthcare"],
  "fundingStages": ["Seed", "Series A"],
  "location": "New York, NY",
  "portfolio": ["Company A", "Company B"],
  "bio": "Experienced tech investor"
}
```

**Response:** `201 Created`

### Get All Investors
**GET** `/api/investors`

Get list of all investors with optional filters.

**Query Parameters:**
- `industries` - Filter by industries (comma-separated)
- `fundingStages` - Filter by funding stages
- `location` - Filter by location
- `page` - Page number
- `limit` - Items per page

**Response:** `200 OK`

### Get Investor by ID
**GET** `/api/investors/:id`

Get detailed information about a specific investor.

**Response:** `200 OK`

### Update Investor
**PUT** `/api/investors/:id`

Update investor profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Delete Investor
**DELETE** `/api/investors/:id`

Delete investor profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Matches Endpoints

### Get Matches
**GET** `/api/matches`

Get AI-powered matches for the current user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` - Number of matches to return (default: 10)
- `minScore` - Minimum match score (0-100)

**Response:** `200 OK`
```json
{
  "success": true,
  "matches": [
    {
      "matchId": "507f1f77bcf86cd799439013",
      "startup": {
        "_id": "507f1f77bcf86cd799439012",
        "companyName": "TechStartup Inc"
      },
      "investor": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "John Investor"
      },
      "matchScore": 85,
      "matchReasons": [
        "Industry alignment",
        "Funding stage match",
        "Geographic proximity"
      ],
      "status": "pending"
    }
  ]
}
```

### Create Match
**POST** `/api/matches`

Create a manual match between startup and investor.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "startupId": "507f1f77bcf86cd799439012",
  "investorId": "507f1f77bcf86cd799439014"
}
```

**Response:** `201 Created`

### Update Match Status
**PUT** `/api/matches/:id`

Update match status (accept/reject).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "accepted" // or "rejected"
}
```

**Response:** `200 OK`

---

## Chat Endpoints

### Get Conversations
**GET** `/api/chat/conversations`

Get all conversations for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "participants": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Doe"
        },
        {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Jane Investor"
        }
      ],
      "lastMessage": {
        "content": "Hello!",
        "timestamp": "2026-01-21T10:00:00.000Z"
      },
      "unreadCount": 2
    }
  ]
}
```

### Get Messages
**GET** `/api/chat/:conversationId/messages`

Get messages for a specific conversation.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` - Page number
- `limit` - Messages per page (default: 50)

**Response:** `200 OK`

### Send Message
**POST** `/api/chat/:conversationId/messages`

Send a message in a conversation.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Hello, interested in your startup!",
  "attachments": []
}
```

**Response:** `201 Created`

---

## AI Features Endpoints

### Get AI Matches
**POST** `/api/ai/matches`

Get AI-powered matchmaking recommendations.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "userType": "startup",
  "preferences": {}
}
```

**Response:** `200 OK`

### Analyze Pitch Deck
**POST** `/api/ai/analyze-pitch`

Get AI feedback on pitch deck.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Multipart form data with pitch deck file)

**Response:** `200 OK`
```json
{
  "success": true,
  "analysis": {
    "score": 85,
    "strengths": ["Clear value proposition", "Strong market analysis"],
    "improvements": ["Add financial projections", "Include team bios"],
    "suggestions": ["Emphasize competitive advantages"]
  }
}
```

### Chat with AI
**POST** `/api/ai/chat`

Chat with AI assistant for business advice.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "What should I include in my pitch deck?",
  "context": "startup"
}
```

**Response:** `200 OK`

---

## File Upload Endpoints

### Upload File
**POST** `/api/upload`

Upload files (pitch decks, documents, images).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:** (Form data with file)
- `file` - The file to upload
- `type` - File type (pitch, document, image)

**Response:** `200 OK`
```json
{
  "success": true,
  "file": {
    "filename": "pitch-deck-123.pdf",
    "path": "uploads/pitch-deck-123.pdf",
    "size": 1048576,
    "mimetype": "application/pdf"
  }
}
```

---

## Notifications Endpoints

### Get Notifications
**GET** `/api/notifications`

Get all notifications for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "type": "match",
      "title": "New Match!",
      "message": "You have a new match with TechStartup Inc",
      "read": false,
      "createdAt": "2026-01-21T10:00:00.000Z"
    }
  ]
}
```

### Mark as Read
**PUT** `/api/notifications/:id/read`

Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **File Upload**: 10 requests per 15 minutes per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642771200
```

---

## WebSocket Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### Join Room
```javascript
socket.emit('join-room', userId);
```

#### Send Message
```javascript
socket.emit('send-message', {
  recipientId: '507f1f77bcf86cd799439014',
  message: 'Hello!',
  senderId: '507f1f77bcf86cd799439011'
});
```

#### Receive Message
```javascript
socket.on('receive-message', (data) => {
  console.log(data); // { senderId, message, timestamp }
});
```

#### Typing Indicator
```javascript
// Send typing
socket.emit('typing', {
  recipientId: '507f1f77bcf86cd799439014',
  isTyping: true
});

// Receive typing
socket.on('user-typing', (data) => {
  console.log(data); // { senderId, isTyping }
});
```

---

## Changelog

### Version 1.0.0 (2026-01-21)
- Initial API release
- Authentication system
- User management
- Startup and investor profiles
- AI-powered matchmaking
- Real-time chat
- File upload functionality
- Notifications system

---

## Support

For API support and questions:
- GitHub Issues: https://github.com/ishivxnshh/AI-Based-Investor-Startup-Matchmaking-Platform/issues
- Email: api-support@venturebridge.com

---

**Last Updated:** January 21, 2026
