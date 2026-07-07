import { describe, it, expect, vi, beforeEach } from 'vitest';
import productForecastService from '../../../src/services/AnalyticsPage/ProductForecast.service.js';
import analyticsModel from '../../../src/model/analytics.model.js';

vi.mock('../../../src/model/analytics.model.js', () => ({
  default: { getProductForecasts: vi.fn() },
}));

describe('Product Forecasting Service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should fetch per-product forecast data and correctly map each product to its predicted demand/stock figures for the given timeframe.', async () => {
    const timeframe = 'Week';
    
    const forecastData = [
      { 
        productName: 'Mocha Dedication Cake', 
        predictedDemand: 92, 
        trendPercentage: 15 
      }
    ];
    analyticsModel.getProductForecasts.mockResolvedValue(forecastData);

    const result = await productForecastService.getProductTrendsByTimeframe(timeframe);

    expect(analyticsModel.getProductForecasts).toHaveBeenCalledWith(timeframe);
    
    expect(result[0]).toHaveProperty('productName', 'Mocha Dedication Cake');
    expect(result[0]).toHaveProperty('predictedDemand', 92);
  });
});