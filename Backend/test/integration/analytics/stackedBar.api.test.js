require('dotenv').config();
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const request = require('supertest');
const express = require('express');

// I-import ang Controller at Service (base sa destructuring sa controller mo)
const { StackedBarController } = require('../../../src/controller/analytics/stackedBar.controller.js');
const  StackedBarService  = require('../../../src/services/AnalyticsPage/StackedBar.service.js');

// Bulletproof Fake Auth
const fakeAuth = (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  if (authHeader.includes('valid-token')) {
    req.admin = { id: 'admin-1' };
    return next();
  }
  return res.status(401).json({ success: false, message: 'No token provided' });
};

// Setup ng Test Express App
const app = express();
app.use(express.json());
app.get('/api/stacked-bar/:timeframe', fakeAuth, StackedBarController.getStackedBarByTimeframe);

describe('Stacked Bar Routes Integration', () => {
  const mockStackedBarData = [
    { period: "Mon", sales: 12000, expenses: 7000 },
    { period: "Tue", sales: 15000, expenses: 8200 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(StackedBarService, 'getStackedBarByTimeframe').mockResolvedValue(mockStackedBarData);
  });

  afterEach(() => vi.restoreAllMocks());

  describe('GET /api/stacked-bar/:timeframe', () => {
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/stacked-bar/Last%207%20Days');
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided'); 
    });

    it('should return 200 and fetch Stacked Bar data with a valid token', async () => {
      const timeframe = 'Last 7 Days';
      const res = await request(app)
        .get(`/api/stacked-bar/${encodeURIComponent(timeframe)}`)
        .set('Authorization', 'Bearer valid-token');
        
      expect(res.status).toBe(200); 
      expect(StackedBarService.getStackedBarByTimeframe).toHaveBeenCalledWith(timeframe);
      expect(res.body.data).toEqual(mockStackedBarData); 
      expect(res.body.message).toBe('Stacked Bar data fetched successfully');
    });
  });
});