require('dotenv').config();
const request = require('supertest');
const express = require('express');

const { ProductService } = require('../../../src/services/product.service.js');
const productRoutes = require('../../../src/routes/product.routes.js');
const { errorHandler } = require('../../../src/middleware/errorHandler.js');

const app = express();
app.use(express.json());
app.use('/api/inventory/products', productRoutes);
app.use(errorHandler);

describe('Product Routes Integration', () => {
  const fakeId = '00000000-0000-0000-0000-000000000000';
  const mockProduct = { id: fakeId, name: 'Ube Cake', category: 'Cakes', price: 250, is_active: true };
  const mockProductList = [
    { id: fakeId, name: 'Ube Cake', category: 'Cakes', price: 250, is_active: true },
    { id: '11111111-1111-1111-1111-111111111111', name: 'Chocolate Roll', category: 'Pastries', price: 150, is_active: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET ALL ──────────────────────────────────────
  describe('GET /api/inventory/products', () => {
    it('should return 200 and fetch all products', async () => {
      vi.spyOn(ProductService, 'getProducts').mockResolvedValue(mockProductList);

      const res = await request(app).get('/api/inventory/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should return 500 when service throws an error', async () => {
      vi.spyOn(ProductService, 'getProducts').mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/inventory/products');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET BY ID ─────────────────────────────────────
  describe('GET /api/inventory/products/:id', () => {
    it('should return 200 and fetch a single product by id', async () => {
      vi.spyOn(ProductService, 'getProductById').mockResolvedValue(mockProduct);

      const res = await request(app).get(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(fakeId);
    });

    it('should return 404 when product is not found', async () => {
      vi.spyOn(ProductService, 'getProductById').mockResolvedValue(null);

      const res = await request(app).get(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return 404 when service throws a 404 error', async () => {
      const err = new Error('Product not found for id=missing');
      err.status = 404;
      vi.spyOn(ProductService, 'getProductById').mockRejectedValue(err);

      const res = await request(app).get(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 500 on unexpected service error', async () => {
      vi.spyOn(ProductService, 'getProductById').mockRejectedValue(new Error('Unexpected'));

      const res = await request(app).get(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  // ── CREATE ────────────────────────────────────────
  describe('POST /api/inventory/products', () => {
    it('should return 201 and create a product with valid payload', async () => {
      vi.spyOn(ProductService, 'createProduct').mockResolvedValue(mockProduct);

      const newProduct = { name: 'Ube Cake', category: 'Cakes', price: 250 };
      const res = await request(app)
        .post('/api/inventory/products')
        .send(newProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Ube Cake');
    });

    it('should return 400 when service throws a validation error', async () => {
      const err = new Error('Validation failed');
      err.status = 400;
      vi.spyOn(ProductService, 'createProduct').mockRejectedValue(err);

      const res = await request(app)
        .post('/api/inventory/products')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 500 on unexpected service error', async () => {
      vi.spyOn(ProductService, 'createProduct').mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/api/inventory/products')
        .send({ name: 'Test' });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  // ── UPDATE ────────────────────────────────────────
  describe('PUT /api/inventory/products/:id', () => {
    it('should return 200 and update an existing product', async () => {
      const updatedProduct = { ...mockProduct, name: 'Updated Ube Cake', price: 300 };
      vi.spyOn(ProductService, 'updateProduct').mockResolvedValue(updatedProduct);

      const res = await request(app)
        .put(`/api/inventory/products/${fakeId}`)
        .send({ name: 'Updated Ube Cake', price: 300 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Ube Cake');
    });

    it('should return 404 when updating non-existent product', async () => {
      const err = new Error('Product not found for id=missing');
      err.status = 404;
      vi.spyOn(ProductService, 'updateProduct').mockRejectedValue(err);

      const res = await request(app)
        .put(`/api/inventory/products/${fakeId}`)
        .send({ name: 'Updated Cake', price: 300 });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 500 on unexpected service error', async () => {
      vi.spyOn(ProductService, 'updateProduct').mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .put(`/api/inventory/products/${fakeId}`)
        .send({ name: 'Test' });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  // ── DELETE ────────────────────────────────────────
  describe('DELETE /api/inventory/products/:id', () => {
    it('should return 200 and delete an existing product', async () => {
      vi.spyOn(ProductService, 'deleteProduct').mockResolvedValue(mockProduct);

      const res = await request(app).delete(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 when deleting non-existent product', async () => {
      const err = new Error('Product not found for id=missing');
      err.status = 404;
      vi.spyOn(ProductService, 'deleteProduct').mockRejectedValue(err);

      const res = await request(app).delete(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 500 on unexpected service error', async () => {
      vi.spyOn(ProductService, 'deleteProduct').mockRejectedValue(new Error('DB error'));

      const res = await request(app).delete(`/api/inventory/products/${fakeId}`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
});

