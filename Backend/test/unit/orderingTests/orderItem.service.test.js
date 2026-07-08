// const { OrderItemService, buildOrderItemPayload } = require('../../../src/services/orderingServices/orderItem.service');
// const { OrderItemModel } = require('../../../src/model/orderingModels/orderItem.model');

// describe('Ordering OrderItemService', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//   });

//   it('should build an order item payload and calculate total price', () => {
//     expect(buildOrderItemPayload({
//       order_id: 'o-1',
//       product_name: 'Cake',
//       quantity: 2,
//       unit_price: 150,
//     })).toEqual({
//       order_id: 'o-1',
//       product_id: null,
//       product_name: 'Cake',
//       variant_label: null,
//       quantity: 2,
//       unit_price: 150,
//       total_price: 300,
//     });
//   });

//   it('should return order items', async () => {
//     const items = [{ id: 'oi-1', order_id: 'o-1' }];
//     vi.spyOn(OrderItemModel, 'findAll').mockResolvedValue({ data: items, error: null });

//     const result = await OrderItemService.getOrderItems({ orderId: 'o-1' });

//     expect(OrderItemModel.findAll).toHaveBeenCalledWith({ orderId: 'o-1' });
//     expect(result).toEqual(items);
//   });

//   it('should create many order items', async () => {
//     vi.spyOn(OrderItemModel, 'createMany').mockResolvedValue({ data: [{ id: 'oi-1' }], error: null });

//     const result = await OrderItemService.createOrderItems([
//       { order_id: 'o-1', product_name: 'Cake', quantity: 2, unit_price: 100 },
//     ]);

//     expect(OrderItemModel.createMany).toHaveBeenCalledWith([expect.objectContaining({
//       order_id: 'o-1',
//       product_name: 'Cake',
//       total_price: 200,
//     })]);
//     expect(result).toEqual([{ id: 'oi-1' }]);
//   });

//   it('should update only provided order item fields', async () => {
//     vi.spyOn(OrderItemModel, 'update').mockResolvedValue({ data: { id: 'oi-1', quantity: 3 }, error: null });

//     const result = await OrderItemService.updateOrderItem('oi-1', { quantity: 3, unit_price: 50 });

//     expect(OrderItemModel.update).toHaveBeenCalledWith('oi-1', {
//       quantity: 3,
//       unit_price: 50,
//       total_price: 150,
//     });
//     expect(result.quantity).toBe(3);
//   });

//   it('should throw when the model returns an error', async () => {
//     const error = new Error('Order item failed');
//     vi.spyOn(OrderItemModel, 'findById').mockResolvedValue({ data: null, error });

//     await expect(OrderItemService.getOrderItemById('oi-1')).rejects.toThrow(error);
//   });
// });

const {
  OrderItemService,
  buildOrderItemPayload,
} = require('../../../src/services/orderingServices/orderItem.service');

const {
  OrderItemModel,
} = require('../../../src/model/orderingModels/orderItem.model');

describe('OrderItemService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildOrderItemPayload()', () => {
    it('should build an order item payload and calculate total price', () => {
      expect(
        buildOrderItemPayload({
          order_id: 'o-1',
          product_name: 'Cake',
          quantity: 2,
          unit_price: 150,
        })
      ).toEqual({
        order_id: 'o-1',
        product_id: null,
        product_name: 'Cake',
        variant_label: null,
        quantity: 2,
        unit_price: 150,
        total_price: 300,
      });
    });
  });

  describe('getOrderItems()', () => {
    it('should return order items', async () => {
      const items = [
        {
          id: 'oi-1',
          order_id: 'o-1',
        },
      ];

      vi.spyOn(OrderItemModel, 'findAll').mockResolvedValue({
        data: items,
        error: null,
      });

      const result = await OrderItemService.getOrderItems({
        orderId: 'o-1',
      });

      expect(OrderItemModel.findAll).toHaveBeenCalledWith({
        orderId: 'o-1',
      });

      expect(result).toEqual(items);
    });
  });

  describe('getOrderItemById()', () => {
    it('should throw when the model returns an error', async () => {
      const error = new Error('Order item failed');

      vi.spyOn(OrderItemModel, 'findById').mockResolvedValue({
        data: null,
        error,
      });

      await expect(
        OrderItemService.getOrderItemById('oi-1')
      ).rejects.toThrow(error);
    });
  });

  describe('createOrderItem()', () => {
    it('should create a single order item', async () => {
      vi.spyOn(OrderItemModel, 'create').mockResolvedValue({
        data: {
          id: 'oi-1',
        },
        error: null,
      });

      const result = await OrderItemService.createOrderItem({
        order_id: 'o-1',
        product_name: 'Cake',
        quantity: 2,
        unit_price: 100,
      });

      expect(OrderItemModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          order_id: 'o-1',
          product_name: 'Cake',
          total_price: 200,
        })
      );

      expect(result).toEqual({
        id: 'oi-1',
      });
    });
  });

  describe('createOrderItems()', () => {
    it('should create many order items', async () => {
      vi.spyOn(OrderItemModel, 'createMany').mockResolvedValue({
        data: [
          {
            id: 'oi-1',
          },
        ],
        error: null,
      });

      const result =
        await OrderItemService.createOrderItems([
          {
            order_id: 'o-1',
            product_name: 'Cake',
            quantity: 2,
            unit_price: 100,
          },
        ]);

      expect(OrderItemModel.createMany).toHaveBeenCalledWith([
        expect.objectContaining({
          order_id: 'o-1',
          product_name: 'Cake',
          total_price: 200,
        }),
      ]);

      expect(result).toEqual([
        {
          id: 'oi-1',
        },
      ]);
    });
  });

  describe('updateOrderItem()', () => {
    it('should update only provided order item fields', async () => {
      vi.spyOn(OrderItemModel, 'update').mockResolvedValue({
        data: {
          id: 'oi-1',
          quantity: 3,
        },
        error: null,
      });

      const result = await OrderItemService.updateOrderItem(
        'oi-1',
        {
          quantity: 3,
          unit_price: 50,
        }
      );

      expect(OrderItemModel.update).toHaveBeenCalledWith(
        'oi-1',
        {
          quantity: 3,
          unit_price: 50,
          total_price: 150,
        }
      );

      expect(result.quantity).toBe(3);
    });
  });

  describe('deleteOrderItem()', () => {
    it('should delete an order item', async () => {
      vi.spyOn(OrderItemModel, 'remove').mockResolvedValue({
        error: null,
      });

      const result = await OrderItemService.deleteOrderItem(
        'oi-1'
      );

      expect(OrderItemModel.remove).toHaveBeenCalledWith(
        'oi-1'
      );

      expect(result).toEqual({
        id: 'oi-1',
      });
    });
  });

  describe('deleteItemsByOrderId()', () => {
    it('should delete all order items by order id', async () => {
      vi.spyOn(OrderItemModel, 'removeByOrderId').mockResolvedValue({
        error: null,
      });

      const result =
        await OrderItemService.deleteItemsByOrderId(
          'o-1'
        );

      expect(
        OrderItemModel.removeByOrderId
      ).toHaveBeenCalledWith('o-1');

      expect(result).toEqual({
        order_id: 'o-1',
      });
    });
  });
});