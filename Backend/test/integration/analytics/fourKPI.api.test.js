require('dotenv').config();
import { describe, it, expect, vi, beforeEach } from 'vitest';
const request = require('supertest');
const express = require('express');

const { FourKpiController } = require('../../../src/controller/analytics/fourKPI.controller.js');
const { FourKpiService } = require('../../../src/services/AnalyticsPage/FourKPI.service.js');
const { errorHandler } = require('../../../src/middleware/errorHandler.js');

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


app.get('/api/four-kpi/:timeframe', fakeAuth, FourKpiController.getKpiByTimeframe);

app.use(errorHandler);

describe('FourKPI Routes Integration', () => {
  const mockKpiData = {
    orders: [{ grand_total: 500, status: 'Completed' }],
    ingredients: [{ name: 'Flour', stock_quantity: 10, cost_per_unit: 50 }]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(FourKpiService, 'getKpiByTimeframe').mockResolvedValue(mockKpiData);
  });

  describe('GET /api/four-kpi/:timeframe', () => {
    
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/four-kpi/Today');
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided'); 
    });

    it('should return 200 and fetch KPI data with a valid token', async () => {
      const timeframe = 'Today';
      const res = await request(app)
        .get(`/api/four-kpi/${timeframe}`)
        .set('Authorization', 'Bearer valid-token');
        
      expect(res.status).toBe(200); 
      expect(FourKpiService.getKpiByTimeframe).toHaveBeenCalledWith(timeframe);
      expect(res.body.data).toEqual(mockKpiData); 
    });

  });
});