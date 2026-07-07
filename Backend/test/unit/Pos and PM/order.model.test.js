const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();
supabaseModule.getSupabase = getSupabase;

const { OrderModel } = require('../../../src/model/order.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('OrderModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should filter orders by status and search term', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await OrderModel.findAll({ status: 'Completed', search: 'ORD-100' });

    expect(client.from).toHaveBeenCalledWith('orders');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(query.eq).toHaveBeenCalledWith('status', 'Completed');
    expect(query.ilike).toHaveBeenCalledWith('order_number', '%ORD-100%');
  });

  it('should load an order with its transactions', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await OrderModel.findById('order-1');

    expect(client.from).toHaveBeenCalledWith('orders');
    expect(query.select).toHaveBeenCalledWith('*, order_transactions(*)');
    expect(query.eq).toHaveBeenCalledWith('id', 'order-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('should create an order through the model', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const payload = { order_number: 'ORD-101', grand_total: 500 };
    await OrderModel.create(payload);

    expect(query.insert).toHaveBeenCalledWith(payload);
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
  });
});
