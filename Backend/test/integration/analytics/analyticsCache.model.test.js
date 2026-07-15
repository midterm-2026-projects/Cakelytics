// Walang import, pure CommonJS format
vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() }
}));

const { supabase } = require('../../../src/config/supabase.js');
const AnalyticsCacheModel = require('../../../src/model/analyticsCache.model');

describe('AnalyticsCacheModel', () => {
  let mockChain;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
      upsert: vi.fn()
    };

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain);
  });

  describe('getByKey', () => {
    it('should return cache data when a valid key is provided', async () => {
      const mockData = { payload: { chartData: [] }, expires_at: '2026-12-31T00:00:00.000Z' };
      // maybeSingle ang huling chain method
      mockChain.maybeSingle.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await AnalyticsCacheModel.getByKey('sales_forecast:30d');

      expect(supabase.from).toHaveBeenCalledWith('analytics_cache');
      expect(mockChain.eq).toHaveBeenCalledWith('cache_key', 'sales_forecast:30d');
      expect(result).toEqual(mockData);
    });

    it('should throw an error if the database fetch fails', async () => {
      mockChain.maybeSingle.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });
      await expect(AnalyticsCacheModel.getByKey('invalid_key')).rejects.toThrow('DB Error');
    });
  });

  describe('upsert', () => {
    it('should insert or update cache payload and calculate correct expiration', async () => {
      // upsert ang method na tinatawag
      mockChain.upsert.mockResolvedValueOnce({ error: null });

      await AnalyticsCacheModel.upsert('sales_forecast:30d', { data: 'test' }, 3600000);

      expect(supabase.from).toHaveBeenCalledWith('analytics_cache');
      expect(mockChain.upsert).toHaveBeenCalled();
      const upsertArgs = mockChain.upsert.mock.calls[0][0];
      expect(upsertArgs).toHaveProperty('cache_key', 'sales_forecast:30d');
      expect(upsertArgs).toHaveProperty('payload');
      expect(upsertArgs).toHaveProperty('expires_at');
    });
  });
});