require('dotenv').config();
const request = require('supertest');
const express = require('express');

// MOCK: Humarang bago pa i-load ang app para hindi tumawag sa totoong database
vi.mock('../../../src/model/auth.model.js', () => ({
  AuthModel: {
    signIn: vi.fn().mockImplementation(async (email, password) => {
      // Kung tugma sa test credentials mo, papasok
      if (email === 'tinadepadua19@gmail.com' && password === 'Araymo.123') {
        return { data: { user: { id: 'u-1', email } }, error: null };
      }
      return { data: null, error: new Error('Invalid credentials') };
    }),
    getAdminById: vi.fn().mockImplementation(async () => {
      return { data: { id: 'u-1', name: 'Admin' }, error: null };
    })
  }
}));

const authRoutes = require('../../../src/routes/auth.routes.js');
const { errorHandler } = require('../../../src/middleware/errorHandler.js');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use(errorHandler);

describe('API testing', () => {

  describe('POST /auth/login', () => {
    it('should return 401 when logging in with invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrongpass' });
      expect(res.status).toBe(401);
    });

    it('should return 200 and a token when logging in with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'tinadepadua19@gmail.com', password: 'Araymo.123' });
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 when accessing without a token', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });
    it('should return 200 when accessing with a valid token', async () => {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'tinadepadua19@gmail.com', password: 'Araymo.123' });

      const token = loginRes.body.data?.token;

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 200 when logging out with a valid token', async () => {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'tinadepadua19@gmail.com', password: 'Araymo.123' });

      const token = loginRes.body.data?.token;  
      
      const logoutRes = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.message).toBe('Logged out');
    });

    it('should return 401 when logging out without a token', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.status).toBe(401);
    });
  });

});