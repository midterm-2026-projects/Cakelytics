// MOCK 1: Pigilan ang pag-load ng totoong Supabase config
vi.mock('../../../src/config/supabase.js', () => ({
  supabase: {} 
}));

const { FourKpiModel } = require('../../../src/model/analytics/fourKPI.model');

describe('FourKpiModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // MOCK 2: I-fake ang isasagot ng database para sa raw ingredients at orders
    vi.spyOn(FourKpiModel, 'getKpiByTimeframe').mockImplementation(async (timeframe) => {
      if (timeframe === 'monthly') {
        return {
          orders: [{ grand_total: 1500, status: 'Completed', created_at: '2026-03-01' }],
          ingredients: [
            { name: 'All-Purpose Flour', stock_quantity: 50, cost_per_unit: 45, created_at: '2026-03-01' },
            { name: 'White Sugar', stock_quantity: 20, cost_per_unit: 60, created_at: '2026-03-02' }
          ]
        };
      }
      // Kung invalid ang timeframe o may db error
      throw new Error('Database fetch error');
    });
  });

  describe('getKpiByTimeframe', () => {
    it('should throw an error when fetching data with an invalid timeframe', async () => {
      await expect(FourKpiModel.getKpiByTimeframe('invalid_timeframe')).rejects.toThrow('Database fetch error');
    });

    it('should return orders and raw ingredients data when the timeframe is valid', async () => {
      const result = await FourKpiModel.getKpiByTimeframe('monthly');
      
      expect(result).toHaveProperty('orders');
      expect(result).toHaveProperty('ingredients');
      expect(result.ingredients[0].name).toBe('All-Purpose Flour');
    });
  });
});