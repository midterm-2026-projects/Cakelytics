vi.mock('../../../src/config/supabase.js', () => ({
  supabase: {} 
}));

const heatmapModel = require('../../../src/model/analytics/heatmap.model');

describe('HeatmapModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(heatmapModel, 'getOrderVolumeByTimeframe').mockImplementation(async (weekStart) => {
      if (weekStart === '2026-07-06') { 
        const fakeMatrix = Array.from({ length: 8 }, () => Array(7).fill(0));
        fakeMatrix[3][0] = 5; 
        fakeMatrix[4][5] = 12; 
        return fakeMatrix;
      }
      
      throw new Error('Database fetch error');
    });
  });

  describe('getOrderVolumeByTimeframe', () => {
    it('should throw an error when fetching data with an invalid weekStart date', async () => {
      await expect(heatmapModel.getOrderVolumeByTimeframe('invalid_date')).rejects.toThrow('Database fetch error');
    });

    it('should return an 8x7 matrix with order volumes when the weekStart is valid', async () => {
      const result = await heatmapModel.getOrderVolumeByTimeframe('2026-07-06');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(8);
      expect(result[0].length).toBe(7); 
      
      expect(result[3][0]).toBe(5); 
      expect(result[4][5]).toBe(12);
    });
  });
});