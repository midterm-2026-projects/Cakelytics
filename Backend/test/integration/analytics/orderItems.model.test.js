import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/config/supabase.js', () => {
  const supabase = { from: vi.fn() };
  return { supabase, getSupabase: () => supabase };
});

const { supabase } = require('../../../src/config/supabase.js');
const OrderItemsModel = require('../../../src/model/orderItems.model.js');

describe('OrderItemsModel', () => {
  let mockChain;

  beforeEach(() => {
    vi.clearAllMocks();

    mockChain = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      neq: vi.fn()
    };

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain);
  });

  describe('getByOrderDateRange', () => {
    it('should fetch embedded order items and exclude cancelled orders', async () => {
      const mockData = [{ product_name: 'Mocha Dedication Cake', quantity: 2 }];
      // Naka-default ang excludeCancelled kaya .neq() ang huling method
      mockChain.neq.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await OrderItemsModel.getByOrderDateRange('2026-03-01', '2026-03-07');

      expect(supabase.from).toHaveBeenCalledWith('order_items');
      expect(mockChain.gte).toHaveBeenCalledWith('orders.created_at', '2026-03-01');
      expect(mockChain.neq).toHaveBeenCalledWith('orders.status', 'Cancelled');
      expect(result).toEqual(mockData);
    });

    it('should throw an error if the database fetch fails', async () => {
      mockChain.neq.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });
      await expect(OrderItemsModel.getByOrderDateRange('2026-03-01', '2026-03-07')).rejects.toThrow('DB Error');
    });
  });
});