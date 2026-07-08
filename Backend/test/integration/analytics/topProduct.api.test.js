require('dotenv').config();
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const request = require('supertest');
const express = require('express');

const { TopProductsController } = require('../../../src/controller/analytics/topProducts.controller.js');
const TopProductsService = require('../../../src/services/AnalyticsPage/TopProducts.service.js');

const fakeAuth = (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  if (authHeader.includes('valid-token')) {
    req.admin = { id: 'admin-1' };
    return next();
  }
  return res.status(401).json({ success: false, message: 'No token provided' });
};

const app = express();
app.use(express.json());
app.get('/api/top-products/:timeframe', fakeAuth, TopProductsController.getTopProducts);

describe('Top Products Routes Integration', () => {
  const mockTopProductsData = [
    { name: 'Package B', sold: 68 },
    { name: 'Package A', sold: 51 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(TopProductsService, 'getTopProductsByTimeframe').mockResolvedValue(mockTopProductsData);
  });

  afterEach(() => vi.restoreAllMocks());

  describe('GET /api/top-products/:timeframe', () => {
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/top-products/Day');
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided'); 
    });

    it('should return 200 and fetch Top Products data with a valid token', async () => {
      const timeframe = 'Day';
      const res = await request(app)
        .get(`/api/top-products/${timeframe}`)
        .set('Authorization', 'Bearer valid-token');
        
      expect(res.status).toBe(200); 
      expect(TopProductsService.getTopProductsByTimeframe).toHaveBeenCalledWith(timeframe);
      expect(res.body.data).toEqual(mockTopProductsData); 
      expect(res.body.message).toBe('Top products fetched successfully');
    });
  });
});