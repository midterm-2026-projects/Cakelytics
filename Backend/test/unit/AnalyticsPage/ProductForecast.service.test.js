import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const productForecastService = require('../../../src/services/AnalyticsPage/ProductForecast.service.js');
const analyticsModel = require('../../../src/model/analytics.model.js');

describe('Product Forecasting Service', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should fetch per-product forecast data and correctly map each product to its predicted demand/stock figures for the given timeframe.', async () => {
    const timeframe = 'Week';
    
    const forecastData = [
      { 
        productName: 'Mocha Dedication Cake', 
        predictedDemand: 92, 
        trendPercentage: 15 
      }
    ];
    
    vi.spyOn(analyticsModel, 'getProductForecasts').mockResolvedValue(forecastData);

    const result = await productForecastService.getProductTrendsByTimeframe(timeframe);

    expect(analyticsModel.getProductForecasts).toHaveBeenCalledWith(timeframe);
    expect(result[0]).toHaveProperty('productName', 'Mocha Dedication Cake');
    expect(result[0]).toHaveProperty('predictedDemand', 92);
  });
});