const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();
supabaseModule.getSupabase = getSupabase;

const OrderItemsModel = require('../../../src/model/orderItems.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('OrderItemsModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMany', () => {
    it('should insert multiple order items', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      const items = [
        { order_id: 'order-1', product_name: 'Chocolate Cake', quantity: 2, unit_price: 450, total_price: 900 },
        { order_id: 'order-1', product_name: 'Ube Cake', quantity: 1, unit_price: 500, total_price: 500 },
      ];
      await OrderItemsModel.createMany(items);

      expect(client.from).toHaveBeenCalledWith('order_items');
      expect(query.insert).toHaveBeenCalledWith(items);
      expect(query.select).toHaveBeenCalled();
    });
  });

  describe('findByOrderId', () => {
    it('should fetch order items by order id', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await OrderItemsModel.findByOrderId('order-1');

      expect(client.from).toHaveBeenCalledWith('order_items');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.eq).toHaveBeenCalledWith('order_id', 'order-1');
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: true });
    });
  });
});
