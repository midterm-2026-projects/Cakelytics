import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() }
}));

const { supabase } = require('../../../src/config/supabase.js');
const OrdersModel = require('../../../src/model/orders.model.js');

describe('OrdersModel', () => {
  let mockChain;

  beforeEach(() => {
    vi.clearAllMocks();

    mockChain = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
    };

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain);
  });

  describe('getByDateRange', () => {
    
    it('should fetch orders and INCLUDE cancelled ones by default', async () => {
      const mockData = [{ grand_total: 1500, status: 'Cancelled', updated_at: '2026-03-01' }];

      // Dahil ang default ay excludeCancelled = false, hanggang .lte() lang ang query.
      // Kaya sa .lte() natin ire-resolve ang mock data.
      mockChain.lte.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await OrdersModel.getByDateRange('2026-03-01', '2026-03-31');

      expect(supabase.from).toHaveBeenCalledWith('orders');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      
      // Pinalitan ng 'updated_at' para mag-match sa model
      expect(mockChain.gte).toHaveBeenCalledWith('updated_at', '2026-03-01');
      expect(mockChain.lte).toHaveBeenCalledWith('updated_at', '2026-03-31');
      
      // Hindi dapat tatawagin ang .neq() dahil false ang default
      expect(mockChain.neq).not.toHaveBeenCalled();
      
      expect(result).toEqual(mockData);
    });

    it('should EXCLUDE cancelled orders when excludeCancelled is set to true', async () => {
      const mockData = [{ grand_total: 1500, status: 'Completed', updated_at: '2026-03-01' }];

      // Kapag excludeCancelled = true, ang huling method sa chain ay .neq()
      mockChain.neq.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await OrdersModel.getByDateRange('2026-03-01', '2026-03-31', { excludeCancelled: true });

      expect(supabase.from).toHaveBeenCalledWith('orders');
      
      // Pinalitan ng 'updated_at'
      expect(mockChain.gte).toHaveBeenCalledWith('updated_at', '2026-03-01');
      expect(mockChain.lte).toHaveBeenCalledWith('updated_at', '2026-03-31');
      
      // Dito papasok ang pag-check kung na-filter ba ang Cancelled
      expect(mockChain.neq).toHaveBeenCalledWith('status', 'Cancelled');
      
      expect(result).toEqual(mockData);
    });
  });
});