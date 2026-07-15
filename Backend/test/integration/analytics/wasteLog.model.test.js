vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() }
}));

const { supabase } = require('../../../src/config/supabase.js');
const WasteLogsModel = require('../../../src/model/wasteLogs.model.js');

describe('WasteLogsModel', () => {
  let mockChain;

  beforeEach(() => {
    vi.clearAllMocks();

    mockChain = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn()
    };

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain);
  });

  describe('getRecent', () => {
    it('should fetch waste logs within the specified date range in descending order', async () => {
      const mockData = [{ item_name: 'Cake Batter', quantity: 2, reason: 'Burnt' }];
      // order() ang huling chain method
      mockChain.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await WasteLogsModel.getRecent('2026-03-01', '2026-03-07');

      expect(supabase.from).toHaveBeenCalledWith('waste_logs');
      expect(mockChain.gte).toHaveBeenCalledWith('logged_at', '2026-03-01');
      expect(mockChain.lte).toHaveBeenCalledWith('logged_at', '2026-03-07');
      expect(mockChain.order).toHaveBeenCalledWith('logged_at', { ascending: false });
      expect(result).toEqual(mockData);
    });

    it('should throw an error if the database fetch fails', async () => {
      mockChain.order.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });
      await expect(WasteLogsModel.getRecent('2026-03-01', '2026-03-07')).rejects.toThrow('DB Error');
    });
  });
});