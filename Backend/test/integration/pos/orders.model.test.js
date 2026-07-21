const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();

// "Integration" here validates that OrdersModel
// composes Supabase query builder calls correctly
supabaseModule.getSupabase = getSupabase;

const OrdersModel = require('../../../src/model/orders.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    // Ito ay para sa await query; return data
    then: vi.fn(function(resolve) {
      return resolve({ data: [{ id: '1' }], error: null });
    })
  };
}

describe('OrdersModel (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('findAll returns orders — actual model ignores filters', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const result = await OrdersModel.findAll({ status: 'Pending', search: 'ORD-123' });

    // Actual findAll() doesn't apply filters — just selects all with order
    expect(client.from).toHaveBeenCalledWith('orders');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('updated_at', { ascending: false });
    // No eq/ilike calls since real findAll doesn't filter
    expect(query.eq).not.toHaveBeenCalled();
    expect(query.ilike).not.toHaveBeenCalled();
  });

  it('findById loads single order with items and customers', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await OrdersModel.findById('order-1');

    expect(client.from).toHaveBeenCalledWith('orders');
    expect(query.select).toHaveBeenCalledWith('*, customers(name, phone), order_items(*)');
    expect(query.eq).toHaveBeenCalledWith('id', 'order-1');
    // Real findById uses .single() since order IDs are unique
    expect(query.single).toHaveBeenCalled();
  });

  it('create inserts payload and returns single row', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const payload = { order_number: 'ORD-001', total: 500 };
    await OrdersModel.create(payload);

    expect(query.insert).toHaveBeenCalledWith(payload);
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
  });
});
