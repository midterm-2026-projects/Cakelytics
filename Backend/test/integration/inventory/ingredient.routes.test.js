require('dotenv').config();
const request = require('supertest');
const express = require('express');

const { IngredientService } = require('../../../src/services/inventory/ingredient.service.js');
const ingredientRoutes = require('../../../src/routes/inventory/ingredient.routes.js');
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
app.use('/api/inventory/ingredients', fakeAuth, ingredientRoutes);
app.use(errorHandler);

describe('Ingredient Routes Integration', () => {
  const safeId = '00000000-0000-0000-0000-000000000000';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(IngredientService, 'getAll').mockResolvedValue([{ id: safeId, name: 'Flour' }]);
    vi.spyOn(IngredientService, 'create').mockResolvedValue({ id: safeId, name: 'Flour' });
    vi.spyOn(IngredientService, 'update').mockResolvedValue({ id: safeId, name: 'Bread flour' });
    vi.spyOn(IngredientService, 'restock').mockResolvedValue({ id: safeId, stock_quantity: 15 });
    vi.spyOn(IngredientService, 'delete').mockResolvedValue(null);
  });

  describe('GET /api/inventory/ingredients', () => {
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/inventory/ingredients');
      expect(res.status).toBe(401);
    });

    it('should return 200 and fetch all ingredients with a valid token', async () => {
      const res = await request(app)
        .get('/api/inventory/ingredients')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].name).toBe('Flour');
    });
  });

  describe('POST /api/inventory/ingredients', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).post('/api/inventory/ingredients').send({});
      expect(res.status).toBe(401);
    });

    it('should return 422 when validation fails (missing required fields)', async () => {
      const res = await request(app)
        .post('/api/inventory/ingredients')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Incomplete' });
      expect(res.status).toBe(422);
    });

    it('should return 201 when ingredient is successfully created', async () => {
      const validPayload = { name: 'Flour', unit: 'kg', stock_quantity: 10, minimum_stock: 2, cost_per_unit: 50 };
      const res = await request(app)
        .post('/api/inventory/ingredients')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Ingredient added');
    });
  });
  describe('PUT /api/inventory/ingredients/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).put(`/api/inventory/ingredients/${safeId}`).send({});
      expect(res.status).toBe(401);
    });

    it('should return 200 when ingredient is successfully updated', async () => {
      const res = await request(app)
        .put(`/api/inventory/ingredients/${safeId}`)
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Bread flour' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Ingredient updated');
    });
  });

  describe('PATCH /api/inventory/ingredients/:id/restock', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).patch(`/api/inventory/ingredients/${safeId}/restock`).send({});
      expect(res.status).toBe(401);
    });

    it('should return 422 when qty is missing in payload', async () => {
    IngredientService.restock.mockRejectedValueOnce({
      name: 'ZodError',
      errors: [{ path: ['added_qty'], message: 'Required' }],
    });

    const res = await request(app)
      .patch(`/api/inventory/ingredients/${safeId}/restock`)
      .set('Authorization', 'Bearer valid-token')
      .send({});

    expect(res.status).toBe(422);
  });

    it('should return 200 when ingredient is successfully restocked', async () => {
      const res = await request(app)
        .patch(`/api/inventory/ingredients/${safeId}/restock`)
        .set('Authorization', 'Bearer valid-token')
        .send({ qty: 5 });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Restocked');
    });
  });

  describe('DELETE /api/inventory/ingredients/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).delete(`/api/inventory/ingredients/${safeId}`);
      expect(res.status).toBe(401);
    });

    it('should return 200 when ingredient is successfully deleted', async () => {
      const res = await request(app)
        .delete(`/api/inventory/ingredients/${safeId}`)
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Ingredient deleted');
    });
  });

});