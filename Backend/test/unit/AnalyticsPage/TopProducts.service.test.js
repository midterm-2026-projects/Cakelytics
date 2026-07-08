import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const TopProductsService = require('../../../src/services/AnalyticsPage/TopProducts.service.js');
const analyticsModel = require('../../../src/model/analytics.model.js');

describe('TopProducts.services', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('It should return only the top 5 best-selling products.', async () => {
    const mockData = [
      { name: 'Package B', sold: 68 }, { name: 'Package A', sold: 51 },
      { name: 'Ensaymada', sold: 45 }, { name: 'Cupcake', sold: 38 },
      { name: 'Brownies', sold: 32 }, { name: 'Pandesal', sold: 20 },
      { name: 'Cookies', sold: 15 },
    ];
    
    // SPY ON METHOD
    vi.spyOn(analyticsModel, 'getTopProductsByTimeframe').mockResolvedValue(mockData);

    const timeframe = 'Day'; 
    const result = await TopProductsService.getTopProductsByTimeframe(timeframe);

    expect(analyticsModel.getTopProductsByTimeframe).toHaveBeenCalledWith(timeframe);
    expect(result).toHaveLength(5);
    expect(result).toEqual(mockData.slice(0, 5));
  });

  it('It should throw AppError when data is null.', async () => {
    vi.spyOn(analyticsModel, 'getTopProductsByTimeframe').mockResolvedValue(null);
    const timeframe = 'Month';

    await expect(TopProductsService.getTopProductsByTimeframe(timeframe))
      .rejects
      .toThrow('AppError');
  });
});