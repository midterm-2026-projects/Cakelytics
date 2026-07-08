const { supabase } = require('../../../src/config/supabase');
const { OrderItemModel } = require('../../../src/model/orderingModels/orderItem.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('Ordering OrderItemModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.from = vi.fn();
  });

  it('should find all order items with filters', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderItemModel.findAll({ orderId: 'o-1', productId: 'p-1' });

    expect(supabase.from).toHaveBeenCalledWith('order_items');
    expect(query.select).toHaveBeenCalledWith(', products()');
    expect(query.eq).toHaveBeenCalledWith('order_id', 'o-1');
    expect(query.eq).toHaveBeenCalledWith('product_id', 'p-1');
  });

  it('should find an order item by id', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderItemModel.findById('oi-1');

    expect(query.eq).toHaveBeenCalledWith('id', 'oi-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('should create one or many order items', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderItemModel.create({ product_name: 'Cake' });
    await OrderItemModel.createMany([{ product_name: 'Cake' }]);

    expect(query.insert).toHaveBeenCalledWith({ product_name: 'Cake' });
    expect(query.insert).toHaveBeenCalledWith([{ product_name: 'Cake' }]);
  });

  it('should update and delete order items', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await OrderItemModel.update('oi-1', { quantity: 2 });
    await OrderItemModel.removeByOrderId('o-1');

    expect(query.update).toHaveBeenCalledWith({ quantity: 2 });
    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('id', 'oi-1');
    expect(query.eq).toHaveBeenCalledWith('order_id', 'o-1');
  });
});
