const { supabase } = require('../../../src/config/supabase');
const { OrderModel } = require('../../../src/model/orderingModels/order.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('Ordering OrderModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.from = vi.fn();
  });

  it('should find all orders with filters', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderModel.findAll({
      status: 'Confirmed',
      source: 'walk-in',
      orderType: 'Pre-Order',
      customerId: 'c-1',
      pickupDate: '2026-07-08',
      search: 'ORD', // 1. Cleaned this input up (removed '~')
    });

    expect(supabase.from).toHaveBeenCalledWith('orders');
    expect(query.select).toHaveBeenCalledWith(expect.stringContaining('customers(*)'));
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(query.eq).toHaveBeenCalledWith('status', 'Confirmed');
    expect(query.eq).toHaveBeenCalledWith('source', 'walk-in');
    expect(query.eq).toHaveBeenCalledWith('order_type', 'Pre-Order');
    expect(query.eq).toHaveBeenCalledWith('customer_id', 'c-1');
    expect(query.eq).toHaveBeenCalledWith('pickup_date', '2026-07-08');
    expect(query.ilike).toHaveBeenCalledWith('order_number', '%ORD%'); 
  });

  it('should find an order by id', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderModel.findById('o-1');

    expect(query.select).toHaveBeenCalledWith(expect.stringContaining('order_items(*)'));
    expect(query.eq).toHaveBeenCalledWith('id', 'o-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('should create and update an order', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderModel.create({ grand_total: 500 });
    await OrderModel.update('o-1', { status: 'Ready' });
    await OrderModel.updateStatus('o-1', 'Completed');

    expect(query.insert).toHaveBeenCalledWith({ grand_total: 500 });
    expect(query.update).toHaveBeenCalledWith({ status: 'Ready' });
    expect(query.update).toHaveBeenCalledWith({ status: 'Completed' });
    expect(query.eq).toHaveBeenCalledWith('id', 'o-1');
  });

  it('should delete an order', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderModel.remove('o-1');

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('id', 'o-1');
  });
});
