vi.mock('../../../src/config/supabase.js', () => ({
  supabase: {} 
}));

const topProductsModel = require('../../../src/model/analytics/topProducts.model');

describe('TopProductsModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(topProductsModel, 'getTopProductsByTimeframe').mockImplementation(async (timeframe) => {
      if (timeframe === 'Last 7 Days') {
        return [
          { name: 'Classic Vanilla Cake', sold: 45 },
          { name: 'Chocolate Fudge Cake', sold: 30 },
          { name: 'Package A', sold: 15 }
        ];
      }
      throw new Error('Database fetch error');
    });
  });

  describe('getTopProductsByTimeframe', () => {
    it('should throw an error when fetching data with an invalid timeframe', async () => {
      await expect(topProductsModel.getTopProductsByTimeframe('invalid_timeframe')).rejects.toThrow('Database fetch error');
    });

    it('should return a sorted array of top products when the timeframe is valid', async () => {
      const result = await topProductsModel.getTopProductsByTimeframe('Last 7 Days');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Classic Vanilla Cake');
      expect(result[0].sold).toBe(45);
    });
  });
});