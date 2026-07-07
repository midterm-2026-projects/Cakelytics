import { describe, it, expect, vi, beforeEach } from 'vitest';
import salesForecastService from '../../../src/services/AnalyticsPage/SalesForecast.service.js';
import analyticsModel from '../../../src/model/analytics.model.js';

vi.mock('../../../src/model/analytics.model.js', () => ({
  default: { getSalesForecasts: vi.fn() },
}));

describe('Sales Forecast Service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should fetch historical and projected sales data scoped to the selected timeframe parameter.', async () => {
    const timeframe = 'Month';
  
    const expectedData = [
      { date: '2026-07-01', actualSales: 15000, projectedSales: 15500 },
      { date: '2026-07-15', actualSales: null, projectedSales: 16200 }
    ];
    analyticsModel.getSalesForecasts.mockResolvedValue(expectedData);

    const result = await salesForecastService.getSalesTrendsByTimeframe(timeframe);

    expect(analyticsModel.getSalesForecasts).toHaveBeenCalledWith(timeframe);
    
    expect(result).toEqual(expectedData);
    expect(result[0]).toHaveProperty('actualSales');
    expect(result[0]).toHaveProperty('projectedSales');
  });
});