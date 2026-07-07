import { describe, it, expect, vi, beforeEach } from 'vitest';
import topProductsService from '../../../src/services/AnalyticsPage/TopProducts.service.js';
import analyticsModel from '../../../src/model/analytics.model.js';

// I-mock natin yung analytics model
vi.mock('../../../src/model/analytics.model.js', () => ({
  default: {
    getTopProductsByTimeframe: vi.fn(),
  },
}));

describe('TopProducts.services', () => {
  beforeEach(() => {
    // I-clear ang mocks bago mag-run ang bawat test para malinis
    vi.clearAllMocks();
  });

  it('It should return only the top 5 best-selling products.', async () => {
    // Arrange: Mag-mock tayo ng 7 products
    const mockData = [
      { name: 'Package B', sold: 68 },
      { name: 'Package A', sold: 51 },
      { name: 'Ensaymada', sold: 45 },
      { name: 'Cupcake', sold: 38 },
      { name: 'Brownies', sold: 32 },
      { name: 'Pandesal', sold: 20 },
      { name: 'Cookies', sold: 15 },
    ];
    
    // I-set yung ire-return ng mock model
    analyticsModel.getTopProductsByTimeframe.mockResolvedValue(mockData);

    // Act: Gagamit tayo ng 'Day' timeframe mula sa timeframeSelector
    const timeframe = 'Day'; 
    const result = await topProductsService.getTopProductsByTimeframe(timeframe);

    // Assert: Dapat tinawag yung model gamit ang tamang timeframe, at 5 items lang ang bumalik
    expect(analyticsModel.getTopProductsByTimeframe).toHaveBeenCalledWith(timeframe);
    expect(result).toHaveLength(5);
    expect(result).toEqual(mockData.slice(0, 5));
  });

  it('It should throw AppError when data is null.', async () => {
    // Arrange: I-set na null ang ibabalik ng database/model
    analyticsModel.getTopProductsByTimeframe.mockResolvedValue(null);
    const timeframe = 'Month';

    // Act & Assert: I-expect na mag-tthrow ito ng 'AppError' kapag null ang data
    await expect(topProductsService.getTopProductsByTimeframe(timeframe))
      .rejects
      .toThrow('AppError');
  });
});