require('dotenv').config();
import { describe, it, expect, vi, beforeEach } from 'vitest';
const request = require('supertest');
const express = require('express');

const { HeatmapController } = require('../../../src/controller/analytics/heatmap.controller.js');
const HeatmapService = require('../../../src/services/AnalyticsPage/Heatmap.service.js');
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

app.get('/api/heatmap/:timeframe', fakeAuth, HeatmapController.getHeatmapData);

app.use(errorHandler);

describe('Heatmap Routes Integration', () => {
  const mockHeatmapData = [
    { day: 'Monday', hour: 9, orderCount: 12 },
    { day: 'Monday', hour: 10, orderCount: 20 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(HeatmapService, 'getOrderVolumeByTimeframe').mockResolvedValue(mockHeatmapData);
  });

  describe('GET /api/heatmap/:timeframe', () => {
    
    it('should return 401 when accessing without a valid token', async () => {
      const res = await request(app).get('/api/heatmap/2023-10-16');
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided'); 
    });

    it('should return 200 and fetch Heatmap data with a valid token', async () => {
      const timeframe = '2023-10-16';
      const res = await request(app)
        .get(`/api/heatmap/${timeframe}`)
        .set('Authorization', 'Bearer valid-token');
        
      expect(res.status).toBe(200); 
      expect(HeatmapService.getOrderVolumeByTimeframe).toHaveBeenCalledWith(timeframe);
      expect(res.body.data).toEqual(mockHeatmapData); 
    });

  });
});