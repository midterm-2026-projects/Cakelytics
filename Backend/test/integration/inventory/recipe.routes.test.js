require('dotenv').config();
const request = require('supertest');
const express = require('express');

const { RecipeService } = require('../../../src/services/inventory/recipe.service.js');
const recipeRoutes = require('../../../src/routes/inventory/recipe.routes.js');
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
app.use('/api/inventory/recipes', fakeAuth, recipeRoutes);
app.use(errorHandler);

describe('Recipe Routes Integration', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(RecipeService, 'getAll').mockResolvedValue([{ id: 'r-1', product_id: 'prod-1' }]);
    vi.spyOn(RecipeService, 'getById').mockResolvedValue({ id: 'r-1', product_id: 'prod-1' });
    vi.spyOn(RecipeService, 'create').mockResolvedValue({ id: 'r-2' });
    vi.spyOn(RecipeService, 'update').mockResolvedValue({ id: 'r-1' });
    vi.spyOn(RecipeService, 'delete').mockResolvedValue(null);
  });

  describe('GET /api/inventory/recipes', () => {
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/inventory/recipes');
      expect(res.status).toBe(401);
    });

    it('should return 200 and fetch all recipes with a valid token', async () => {
      const res = await request(app)
        .get('/api/inventory/recipes')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data[0].id).toBe('r-1');
    });
  });

  describe('GET /api/inventory/recipes/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).get('/api/inventory/recipes/r-1');
      expect(res.status).toBe(401);
    });

    it('should return 200 and fetch specific recipe with a valid token', async () => {
      const res = await request(app)
        .get('/api/inventory/recipes/r-1')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('r-1');
    });
  });

  describe('POST /api/inventory/recipes', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).post('/api/inventory/recipes').send({});
      expect(res.status).toBe(401);
    });

    it('should return 422 when validation fails (missing required fields)', async () => {
      const res = await request(app)
        .post('/api/inventory/recipes')
        .set('Authorization', 'Bearer valid-token')
        .send({ yield_quantity: 1 }); 
      expect(res.status).toBe(422);
    });

    it('should return 201 when recipe is successfully created', async () => {
      const validPayload = { 
        product_id: '00000000-0000-0000-0000-000000000000', 
        yield_quantity: 1, 
        yield_unit: 'pcs', 
        estimated_cost: 100, 
        ingredients: [
          { item_type: 'raw', item_name: 'Flour', quantity: 1, unit: 'kg' } 
        ] 
      };
      
      const res = await request(app)
        .post('/api/inventory/recipes')
        .set('Authorization', 'Bearer valid-token')
        .send(validPayload);
        
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Recipe created');
    });
  });

  describe('PUT /api/inventory/recipes/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).put('/api/inventory/recipes/r-1').send({});
      expect(res.status).toBe(401);
    });

    it('should return 200 when recipe is successfully updated', async () => {
      const res = await request(app)
        .put('/api/inventory/recipes/r-1')
        .set('Authorization', 'Bearer valid-token')
        .send({ yield_quantity: 2 });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Recipe updated');
    });
  });

  describe('DELETE /api/inventory/recipes/:id', () => {
    it('should return 401 without a valid token', async () => {
      const res = await request(app).delete('/api/inventory/recipes/r-1');
      expect(res.status).toBe(401);
    });

    it('should return 200 when recipe is successfully deleted', async () => {
      const res = await request(app)
        .delete('/api/inventory/recipes/r-1')
        .set('Authorization', 'Bearer valid-token');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Recipe deleted');
    });
  });

});