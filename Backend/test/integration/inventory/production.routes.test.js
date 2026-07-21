require('dotenv').config();
const request = require('supertest');
const express = require('express');

const { ProductionService } = require('../../../src/services/inventory.service.js');
const productionRoutes = require('../../../src/routes/inventory.routes.js');
const { errorHandler } = require('../../../src/middleware/errorHandler.js');

// FAKE AUTH
const fakeAuth = (req, res, next) => {
  if (req.header('Authorization') === 'Bearer valid-token') {
    req.admin = { id: 'admin-1' };
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized' });
};

const app = express();
app.use(express.json());
app.use('/api/inventory', fakeAuth, productionRoutes);
app.use(errorHandler);

describe('Production Routes Integration', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ProductionService, 'getAll').mockResolvedValue([{ id: 'p-1', product_name: 'Cake' }]);
    vi.spyOn(ProductionService, 'confirmBatch').mockResolvedValue({ id: 'p-2', batches: 2 });
  });

  // ==========================================
  // ENDPOINT: GET /api/inventory/production
  // ==========================================
  describe('GET /api/inventory/production', () => {
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/inventory/production');
      expect(res.status).toBe(401);
    });

    it('should return 200 and fetch all production logs with a valid token', async () => {
      const res = await request(app)
        .get('/api/inventory/production')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].product_name).toBe('Cake');
    });
  });

  // ==========================================
  // ENDPOINT: POST /api/inventory/production
  // ==========================================
  describe('POST /api/inventory/production', () => {
    it('should return 401 when confirming a batch without a token', async () => {
      const res = await request(app).post('/api/inventory/production').send({});
      expect(res.status).toBe(401);
    });

    it('should return 422 when validation fails (missing required fields)', async () => {
      const res = await request(app)
        .post('/api/inventory/production')
        .set('Authorization', 'Bearer valid-token')
        .send({ batches: 1 }); // Kulang ng recipe_id
      expect(res.status).toBe(422);
    });

    it('should return 201 when production batch is successfully logged', async () => {
      const validPayload = { 
        recipe_id: '00000000-0000-0000-0000-000000000000', 
        product_id: '00000000-0000-0000-0000-000000000000', 
        product_name: 'Classic Vanilla Cake',            
        batches: 1, 
        total_produced: 10,                               
        yield_unit: 'pcs',                                
        notes: 'Test log' 
      };
      
      const res = await request(app)
        .post('/api/inventory/production')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);
        
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Production batch logged');
    });
  });

});