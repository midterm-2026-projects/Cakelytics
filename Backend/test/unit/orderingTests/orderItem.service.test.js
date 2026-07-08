const { OrderItemService, buildOrderItemPayload } = require('../../../src/services/orderingServices/orderItem.service');
const { OrderItemModel } = require('../../../src/model/orderingModels/orderItem.model');

describe('Ordering OrderItemService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should build an order item payload and calculate total price', () => {
    expect(buildOrderItemPayload({
      order_id: 'o-1',
      product_name: 'Cake',
      quantity: 2,
      unit_price: 150,
    })).toEqual({
      order_id: 'o-1',
      product_id: null,
      product_name: 'Cake',
      variant_label: null,
      quantity: 2,
      unit_price: 150,
      total_price: 300,
    });
  });

  it('should return order items', async () => {
    const items = [{ id: 'oi-1', order_id: 'o-1' }];
    vi.spyOn(OrderItemModel, 'findAll').mockResolvedValue({ data: items, error: null });

    const result = await OrderItemService.getOrderItems({ orderId: 'o-1' });

    expect(OrderItemModel.findAll).toHaveBeenCalledWith({ orderId: 'o-1' });
    expect(result).toEqual(items);
  });

  it('should create many order items', async () => {
    vi.spyOn(OrderItemModel, 'createMany').mockResolvedValue({ data: [{ id: 'oi-1' }], error: null });

    const result = await OrderItemService.createOrderItems([
      { order_id: 'o-1', product_name: 'Cake', quantity: 2, unit_price: 100 },
    ]);

    expect(OrderItemModel.createMany).toHaveBeenCalledWith([expect.objectContaining({
      order_id: 'o-1',
      product_name: 'Cake',
      total_price: 200,
    })]);
    expect(result).toEqual([{ id: 'oi-1' }]);
  });

  it('should update only provided order item fields', async () => {
    vi.spyOn(OrderItemModel, 'update').mockResolvedValue({ data: { id: 'oi-1', quantity: 3 }, error: null });

    const result = await OrderItemService.updateOrderItem('oi-1', { quantity: 3, unit_price: 50 });

    expect(OrderItemModel.update).toHaveBeenCalledWith('oi-1', {
      quantity: 3,
      unit_price: 50,
      total_price: 150,
    });
    expect(result.quantity).toBe(3);
  });

  it('should throw when the model returns an error', async () => {
    const error = new Error('Order item failed');
    vi.spyOn(OrderItemModel, 'findById').mockResolvedValue({ data: null, error });

    await expect(OrderItemService.getOrderItemById('oi-1')).rejects.toThrow(error);
  });
});