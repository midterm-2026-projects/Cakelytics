import { describe, it, expect, vi, beforeEach } from 'vitest';

// =========================================================================
// 1. SUPABASE MOCK SETUP
// =========================================================================
const supabaseModule = require('../../../src/config/supabase');

const getSupabase = vi.fn();

// I-bind ang mock sa supabase module
supabaseModule.getSupabase = getSupabase;

// Dynamic require para sa OrdersModel nang walang destructuring destructuring error
const OrdersModel = require('../../../src/model/orders.model');

// Shared query chain variable
let queryForGetSupabase;

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    then: vi.fn(function (resolve) {
      return resolve({ data: [], error: null });
    }),
  };
}

// =========================================================================
// MAIN TEST SUITE
// =========================================================================
describe('OrdersModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Gumawa ng bagong query chain instance bago ang bawat test
    queryForGetSupabase = buildQueryChain();

    // Default setup para sa getSupabase
    const defaultClient = { from: vi.fn(() => queryForGetSupabase) };
    getSupabase.mockReturnValue(defaultClient);
  });

  // === JERICK'S TESTS ===
  it('should list orders from findAll (actual model ignores filters)', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const result = await OrdersModel.findAll({ status: 'Completed', search: 'ORD-100' });

    expect(client.from).toHaveBeenCalledWith('orders');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('updated_at', { ascending: false });
    // Actual findAll() doesn't apply filters
    expect(query.eq).not.toHaveBeenCalled();
    expect(query.ilike).not.toHaveBeenCalled();
  });

  it('should load an order with its transactions and customers', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await OrdersModel.findById('order-1');

    expect(client.from).toHaveBeenCalledWith('orders');
    // Tugma na sa real code na '*, customers(name, phone), order_items(*)'
    expect(query.select).toHaveBeenCalledWith('*, customers(name, phone), order_items(*)');
    expect(query.eq).toHaveBeenCalledWith('id', 'order-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('should create an order through the model', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const payload = { order_number: 'ORD-101', grand_total: 500 };
    await OrdersModel.create(payload);

    expect(query.insert).toHaveBeenCalledWith(payload);
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
  });

  // === PRINCES' TESTS ===
  describe('findAll', () => {
    it('does not apply status filter (actual findAll has no filter logic)', async () => {
      await OrdersModel.findAll({ status: 'Completed' });
      expect(queryForGetSupabase.eq).not.toHaveBeenCalled();
    });

    it('does not apply search filter (actual findAll has no filter logic)', async () => {
      await OrdersModel.findAll({ search: 'ORD-123' });
      expect(queryForGetSupabase.ilike).not.toHaveBeenCalled();
    });

    it("does nothing special for status 'All' (no filter logic)", async () => {
      await OrdersModel.findAll({ status: 'All' });
      expect(queryForGetSupabase.eq).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('queries by id and fetches single record', async () => {
      await OrdersModel.findById(101);
      expect(queryForGetSupabase.eq).toHaveBeenCalledWith('id', 101);
      expect(queryForGetSupabase.single).toHaveBeenCalled();
    });
  });

  describe('getByDateRange', () => {
    it('applies gte and lte on updated_at', async () => {
      await OrdersModel.getByDateRange('2026-01-01', '2026-01-31');
      expect(queryForGetSupabase.gte).toHaveBeenCalledWith('updated_at', '2026-01-01');
      expect(queryForGetSupabase.lte).toHaveBeenCalledWith('updated_at', '2026-01-31');
    });

    it('selects specified columns', async () => {
      await OrdersModel.getByDateRange('2026-01-01', '2026-01-31', {
        columns: 'id,order_number',
      });
      expect(queryForGetSupabase.select).toHaveBeenCalledWith('id,order_number');
    });

    it("excludes cancelled when excludeCancelled is true", async () => {
      await OrdersModel.getByDateRange('2026-01-01', '2026-01-31', { excludeCancelled: true });
      expect(queryForGetSupabase.neq).toHaveBeenCalledWith('status', 'Cancelled');
    });

    it('throws when supabase returns an error', async () => {
      const error = new Error('boom');
      // Create a fresh query chain that returns error on await
      const errorQuery = buildQueryChain();
      errorQuery.then = vi.fn((resolve) => resolve({ data: null, error }));
      const errorClient = { from: vi.fn().mockReturnValue(errorQuery) };
      getSupabase.mockReturnValue(errorClient);

      await expect(OrdersModel.getByDateRange('2026-01-01', '2026-01-31')).rejects.toThrow('boom');
    });
  });
});

// Helper wrapper para maging madali ang pag-set ng mock client
function getSupabaseMockReturnValue(client) {
  getSupabase.mockReturnValue(client);
}
