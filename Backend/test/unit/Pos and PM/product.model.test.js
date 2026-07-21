const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();
supabaseModule.getSupabase = getSupabase;

const { SalesModel, OrderTransactionModel } = require('../../../src/model/sales.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('SalesModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list sales with a limit', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await SalesModel.findAll(20);

    expect(client.from).toHaveBeenCalledWith('sales');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('sold_at', { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(20);
  });

  it('should create a sale through the model', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const payload = { sale_number: 'SALE-1', grand_total: 250 };
    await SalesModel.create(payload);

    expect(query.insert).toHaveBeenCalledWith(payload);
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
  });
});

describe('OrderTransactionModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch transaction rows for an order', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await OrderTransactionModel.findByOrderId('order-1');

    expect(client.from).toHaveBeenCalledWith('order_transactions');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('order_id', 'order-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: true });
  });

  it('should create many order transactions', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const items = [{ product_name: 'Cake', quantity: 2 }];
    await OrderTransactionModel.createMany(items);

    expect(query.insert).toHaveBeenCalledWith(items);
    expect(query.select).toHaveBeenCalled();
  });
});
// princes