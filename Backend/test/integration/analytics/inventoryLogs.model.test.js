import { describe, it, expect, vi, beforeEach } from "vitest";

const { supabase } = require('../../../src/config/supabase.js');
const InventoryLogsModel = require('../../../src/model/inventoryLogs.model.js');

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() }
}));

describe('InventoryLogsModel', () => {
  let mockChain;

  beforeEach(() => {
    vi.clearAllMocks();

    mockChain = {
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(), 
    };

    vi.spyOn(supabase, 'from').mockReturnValue(mockChain);
  });

  describe('getByDateRange', () => {
    
    it('should construct the correct Supabase query and return data successfully', async () => {
      const mockData = [
        { item_name: 'Cocoa powder', transaction_type: 'IN', cost: 1233.00, action: 'Restock', created_at: '2026-07-10' }
      ];

      mockChain.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await InventoryLogsModel.getByDateRange('2026-07-01', '2026-07-31');

      // Validating na walang nakalimutang column sa select string
      expect(mockChain.select).toHaveBeenCalledWith('item_type, item_name, transaction_type, quantity, cost, action, created_at');
      expect(mockChain.gte).toHaveBeenCalledWith('created_at', '2026-07-01');
      expect(mockChain.lte).toHaveBeenCalledWith('created_at', '2026-07-31');
      
      expect(result).toEqual(mockData);
    });

   
    it('should throw an error when the Supabase query fails', async () => {
      const dbError = new Error("Supabase connection timeout");

      // I-simulate na nag-fail ang database request
      mockChain.order.mockResolvedValueOnce({ data: null, error: dbError });

      // Expect natin na ibabato pataas yung mismong error
      await expect(
        InventoryLogsModel.getByDateRange('2026-07-01', '2026-07-31')
      ).rejects.toThrow("Supabase connection timeout");
    });

  });
});