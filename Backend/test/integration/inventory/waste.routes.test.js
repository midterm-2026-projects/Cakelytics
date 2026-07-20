require('dotenv').config();
const request = require('supertest');
const express = require('express');

const { WasteService } = require('../../../src/services/inventory.service.js');
const wasteRoutes = require('../../../src/routes/inventory.routes.js');
const { errorHandler } = require('../../../src/middleware/errorHandler.js');

const fakeAuth = (req, res, next) => {
  if (req.header('Authorization') === 'Bearer valid-token') {
    req.admin = { id: 'admin-1' };
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized' });
};

const app = express();
app.use(express.json());
app.use('/api/inventory', fakeAuth, wasteRoutes);
app.use(errorHandler);

describe('Waste Routes Integration', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(WasteService, 'getAll').mockResolvedValue([{ id: 'w-1', item_name: 'Spoiled Milk' }]);
    vi.spyOn(WasteService, 'log').mockResolvedValue({ id: 'w-2', item_name: 'Flour' });
  });

  describe('GET /api/inventory', () => {
    
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/inventory/waste');
      expect(res.status).toBe(401);
    });

    it('should return 200 and fetch all waste logs with a valid token', async () => {
      const res = await request(app)
        .get('/api/inventory/waste')
        .set('Authorization', 'Bearer valid-token');
      
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].item_name).toBe('Spoiled Milk');
    });
  });

  describe('POST /api/inventory/waste', () => {
    
    it('should return 401 when logging waste without a valid token', async () => {
      const res = await request(app).post('/api/inventory/waste').send({});
      expect(res.status).toBe(401);
    });

    it('should return 422 when validation fails due to missing fields', async () => {
      const invalidPayload = { item_name: 'Incomplete' }; 
      
      const res = await request(app)
        .post('/api/inventory/waste')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidPayload);
      
      
      expect(res.status).toBe(422); 
    });

    it('should return 201 when waste is successfully logged', async () => {
      const validPayload = {
        waste_type: 'ingredient',
        item_name: 'Flour',
        quantity: 1,
        unit: 'kg',
        reason: 'Spoiled'
      };

      const res = await request(app)
        .post('/api/inventory/waste')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Waste logged');
    });
  });

});