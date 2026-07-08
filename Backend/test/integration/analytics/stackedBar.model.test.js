vi.mock('../../../src/config/supabase.js', () => ({
  supabase: {} 
}));

const { StackedBarModel } = require('../../../src/model/analytics/stackedBar.model');

describe('StackedBarModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(StackedBarModel, 'getStackedBarByTimeframe').mockImplementation(async (timeframe) => {
      if (timeframe === 'weekly') {
        return {
          orders: [{ grand_total: 3000, status: 'Completed', created_at: '2026-03-10' }],
          ingredients: [
            { name: 'Baking Powder', stock_quantity: 15, cost_per_unit: 25, created_at: '2026-03-10' }
          ]
        };
      }
      throw new Error('Invalid query or no data');
    });
  });

  describe('getStackedBarByTimeframe', () => {
    it('should throw an error when fetching stacked bar data fails', async () => {
      await expect(StackedBarModel.getStackedBarByTimeframe('unknown')).rejects.toThrow('Invalid query or no data');
    });

    it('should return correctly ordered sales and raw ingredients data when timeframe is valid', async () => {
      const result = await StackedBarModel.getStackedBarByTimeframe('weekly');
      
      expect(result).toHaveProperty('orders');
      expect(result).toHaveProperty('ingredients');
      expect(result.ingredients.length).toBeGreaterThan(0);
    });
  });
});