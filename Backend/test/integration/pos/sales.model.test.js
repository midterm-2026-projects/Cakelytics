const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();

// “Integration” here validates that SalesModel/OrderTransactionModel
// compose Supabase query builder calls correctly end-to-end,
// without hitting a real database.
supabaseModule.getSupabase = getSupabase;

const { SalesModel, OrderTransactionModel } = require('../../../src/model/sales.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('SalesModel (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('findAll lists sales with limit + sold_at order', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await SalesModel.findAll(20);

    expect(client.from).toHaveBeenCalledWith('sales');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('sold_at', { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(20);
  });

  it('create inserts payload and returns single row', async () => {
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

describe('OrderTransactionModel (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('findByOrderId loads transaction rows for an order', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await OrderTransactionModel.findByOrderId('order-1');

    expect(client.from).toHaveBeenCalledWith('order_transactions');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('order_id', 'order-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: true });
  });

  it('createMany inserts many order transaction items', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const items = [{ product_name: 'Cake', quantity: 2 }];
    await OrderTransactionModel.createMany(items);

    expect(query.insert).toHaveBeenCalledWith(items);
    expect(query.select).toHaveBeenCalled();
  });
});

