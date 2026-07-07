const { OrderService } = require('../../../src/services/order.service');
const { OrderModel } = require('../../../src/model/order.model');

describe('OrderService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return orders when getOrders succeeds', async () => {
    const orders = [{ id: 'o-1', order_number: 'ORD-100' }];
    vi.spyOn(OrderModel, 'findAll').mockResolvedValue({ data: orders, error: null });

    const result = await OrderService.getOrders({ status: 'Pending' });

    expect(OrderModel.findAll).toHaveBeenCalledWith({ status: 'Pending' });
    expect(result).toEqual(orders);
  });

  it('should throw when getOrders returns an error', async () => {
    const error = new Error('Database failure');
    vi.spyOn(OrderModel, 'findAll').mockResolvedValue({ data: null, error });

    await expect(OrderService.getOrders({})).rejects.toThrow(error);
  });

  it('should return an order by id', async () => {
    const order = { id: 'o-2', order_number: 'ORD-101' };
    vi.spyOn(OrderModel, 'findById').mockResolvedValue({ data: order, error: null });

    const result = await OrderService.getOrderById('o-2');

    expect(OrderModel.findById).toHaveBeenCalledWith('o-2');
    expect(result).toEqual(order);
  });

  it('should throw when getOrderById returns an error', async () => {
    const error = new Error('Not found');
    vi.spyOn(OrderModel, 'findById').mockResolvedValue({ data: null, error });

    await expect(OrderService.getOrderById('o-2')).rejects.toThrow(error);
  });

  it('should create an order with default values', async () => {
    const body = { customer_name: 'John Doe', subtotal: 100 };
    vi.spyOn(OrderModel, 'create').mockResolvedValue({ data: { id: 'o-3' }, error: null });

    const result = await OrderService.createOrder(body);

    expect(OrderModel.create).toHaveBeenCalledWith({
      order_number: expect.stringMatching(/^ORD-/),
      customer_name: 'John Doe',
      order_type: 'Pre-order',
      status: 'Pending',
      subtotal: 100,
      additional_fee: 0,
      discount: 0,
      grand_total: 0,
    });
    expect(result).toEqual({ id: 'o-3' });
  });

  it('should create an order with provided order number and status', async () => {
    const body = { order_number: 'ORD-500', customer_name: 'Jane', status: 'Completed', subtotal: 200, grand_total: 250 };
    vi.spyOn(OrderModel, 'create').mockResolvedValue({ data: { id: 'o-4' }, error: null });

    const result = await OrderService.createOrder(body);

    expect(OrderModel.create).toHaveBeenCalledWith(expect.objectContaining({
      order_number: 'ORD-500',
      customer_name: 'Jane',
      status: 'Completed',
      subtotal: 200,
      grand_total: 250,
    }));
    expect(result).toEqual({ id: 'o-4' });
  });

  it('should throw when createOrder returns an error', async () => {
    const error = new Error('Insert failed');
    vi.spyOn(OrderModel, 'create').mockResolvedValue({ data: null, error });

    await expect(OrderService.createOrder({ customer_name: 'Test' })).rejects.toThrow(error);
  });
});
