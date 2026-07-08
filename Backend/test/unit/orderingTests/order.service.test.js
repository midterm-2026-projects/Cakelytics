const { OrderService, buildOrderPayload } = require('../../../src/services/orderingServices/order.service');
const { OrderModel } = require('../../../src/model/orderingModels/order.model');
const { CustomerService } = require('../../../src/services/orderingServices/customer.service');
const { OrderItemService } = require('../../../src/services/orderingServices/orderItem.service');

describe('Ordering OrderService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should build an order payload with defaults', () => {
    expect(buildOrderPayload({ subtotal: 100, grand_total: 100 })).toEqual(expect.objectContaining({
      order_number: '',
      customer_id: null,
      order_type: 'Pre-Order',
      source: 'walk-in',
      status: 'Confirmed',
      subtotal: 100,
      grand_total: 100,
      payment_type: 'full',
      special_instructions: '',
    }));
  });

  it('should return orders', async () => {
    const orders = [{ id: 'o-1', order_number: 'ORD-0001' }];
    vi.spyOn(OrderModel, 'findAll').mockResolvedValue({ data: orders, error: null });

    const result = await OrderService.getOrders({ status: 'Confirmed' });

    expect(OrderModel.findAll).toHaveBeenCalledWith({ status: 'Confirmed' });
    expect(result).toEqual(orders);
  });

  it('should create an order', async () => {
    vi.spyOn(OrderModel, 'create').mockResolvedValue({ data: { id: 'o-1' }, error: null });

    const result = await OrderService.createOrder({ customer_id: 'c-1', grand_total: 500 });

    expect(OrderModel.create).toHaveBeenCalledWith(expect.objectContaining({
      customer_id: 'c-1',
      grand_total: 500,
      source: 'walk-in',
    }));
    expect(result).toEqual({ id: 'o-1' });
  });

  it('should create an order with customer and items', async () => {
    vi.spyOn(CustomerService, 'createCustomer').mockResolvedValue({ id: 'c-1', name: 'Ana' });
    vi.spyOn(OrderService, 'createOrder').mockResolvedValue({ id: 'o-1', customer_id: 'c-1' });
    vi.spyOn(OrderItemService, 'createOrderItems').mockResolvedValue([{ id: 'oi-1' }]);

    const result = await OrderService.createOrderWithItems({
      customer: { name: 'Ana', phone: '0917' },
      items: [{ product_name: 'Cake', quantity: 1, unit_price: 500 }],
    });

    expect(CustomerService.createCustomer).toHaveBeenCalledWith({ name: 'Ana', phone: '0917' });
    expect(OrderService.createOrder).toHaveBeenCalledWith(expect.objectContaining({ customer_id: 'c-1' }));
    expect(OrderItemService.createOrderItems).toHaveBeenCalledWith([
      expect.objectContaining({ order_id: 'o-1', product_name: 'Cake' }),
    ]);
    expect(result.order_items).toEqual([{ id: 'oi-1' }]);
  });

  it('should throw when the model returns an error', async () => {
    const error = new Error('Order failed');
    vi.spyOn(OrderModel, 'findById').mockResolvedValue({ data: null, error });

    await expect(OrderService.getOrderById('o-1')).rejects.toThrow(error);
  });
});