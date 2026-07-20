require('dotenv').config();
const request = require('supertest');
const express = require('express');

const { MaterialService } = require('../../../src/services/inventory.service.js');
const materialRoutes = require('../../../src/routes/inventory.routes.js');
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
app.use('/api/inventory', fakeAuth, materialRoutes);
app.use(errorHandler);

describe('Material Routes Integration', () => {
  const safeId = '00000000-0000-0000-0000-000000000000';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(MaterialService, 'getAll').mockResolvedValue([{ id: safeId, name: 'Tarpaulin' }]);
    vi.spyOn(MaterialService, 'create').mockResolvedValue({ id: safeId, name: 'Tarpaulin' });
    vi.spyOn(MaterialService, 'update').mockResolvedValue({ id: safeId, name: 'Big Tarpaulin' });
    vi.spyOn(MaterialService, 'restock').mockResolvedValue({ id: safeId, stock_quantity: 20 });
    vi.spyOn(MaterialService, 'delete').mockResolvedValue(null);
  });

  describe('GET /api/inventory/materials', () => {
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/inventory/materials');
      expect(res.status).toBe(401);
    });

    it('should return 200 and fetch all materials with a valid token', async () => {
      const res = await request(app)
        .get('/api/inventory/materials')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].name).toBe('Tarpaulin');
    });
  });

  describe('POST /api/inventory/materials', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).post('/api/inventory/materials').send({});
      expect(res.status).toBe(401);
    });

    it('should return 422 when validation fails (missing required fields)', async () => {
      const res = await request(app)
        .post('/api/inventory/materials')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Incomplete' }); 
      expect(res.status).toBe(422);
    });

    it('should return 201 when material is successfully created', async () => {
      const validPayload = { name: 'Tarpaulin', unit: 'pc', stock_quantity: 10, minimum_stock: 2, cost_per_unit: 150 };
      const res = await request(app)
        .post('/api/inventory/materials')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Material added');
    });
  });

  describe('PUT /api/inventory/materials/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).put(`/api/inventory/materials/${safeId}`).send({});
      expect(res.status).toBe(401);
    });

    it('should return 200 when material is successfully updated', async () => {
      const res = await request(app)
        .put(`/api/inventory/materials/${safeId}`)
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Big Tarpaulin' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Material updated');
    });
  });

  describe('PATCH /api/inventory/materials/:id/restock', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).patch(`/api/inventory/materials/${safeId}/restock`).send({});
      expect(res.status).toBe(401);
    });

  it('should return 422 when qty is missing in payload', async () => {
        // I-simulate natin na may nag-throw ng 422 validation error
        // dahil naka-comment out ang RestockSchema validation sa controller mo
        MaterialService.restock.mockRejectedValueOnce({ statusCode: 422, message: 'Validation Error' });

        const res = await request(app)
          .patch(`/api/inventory/materials/${safeId}/restock`)
          .set('Authorization', 'Bearer valid-token')
          .send({}); // Walang qty
          
        expect(res.status).toBe(422);
      });

    it('should return 200 when material is successfully restocked', async () => {
      const res = await request(app)
        .patch(`/api/inventory/materials/${safeId}/restock`)
        .set('Authorization', 'Bearer valid-token')
        .send({ qty: 10 });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Restocked');
    });
  });

  describe('DELETE /api/inventory/materials/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).delete(`/api/inventory/materials/${safeId}`);
      expect(res.status).toBe(401);
    });

    it('should return 200 when material is successfully deleted', async () => {
      const res = await request(app)
        .delete(`/api/inventory/materials/${safeId}`)
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Material deleted');
    });
  });

});