import request from 'supertest';
import app from '../index.js';
import User from '../models/User.js';
import { connectDB, disconnectDB } from '../config/database.js';

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean up test data
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'startup'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'startup'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'startup'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User already exists with this email');
    });

    // BUG FIX TESTS: Email case-sensitivity
    it('should not register user with existing email (different case) - UPPERCASE', async () => {
      const userData1 = {
        fullName: 'Test User 1',
        email: 'bugtest@example.com',
        password: 'password123',
        role: 'startup'
      };

      const userData2 = {
        fullName: 'Test User 2',
        email: 'BUGTEST@EXAMPLE.COM', // Same email, uppercase
        password: 'password456',
        role: 'investor'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData1)
        .expect(201);

      // Try to create second user with same email in different case
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User already exists with this email');
    });

    it('should not register user with existing email (different case) - MixedCase', async () => {
      const userData1 = {
        fullName: 'Test User 1',
        email: 'MixedCase@Example.COM',
        password: 'password123',
        role: 'startup'
      };

      const userData2 = {
        fullName: 'Test User 2',
        email: 'mixedcase@example.com', // Same email, lowercase
        password: 'password456',
        role: 'investor'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData1)
        .expect(201);

      // Try to create second user with same email in different case
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User already exists with this email');
    });

    it('should store email in lowercase format', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'UPPERCASE@EXAMPLE.COM',
        password: 'password123',
        role: 'startup'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('uppercase@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'startup'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('should not login user with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should not login user with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    // BUG FIX TEST: Login with different email case should work
    it('should login user with email in different case', async () => {
      const loginData = {
        email: 'TEST@EXAMPLE.COM', // Different case than registered email
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Create a test user and get token
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'startup'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      token = registerResponse.body.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not get current user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not authorized to access this route');
    });

    it('should not get current user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not authorized to access this route');
    });
  });
});
