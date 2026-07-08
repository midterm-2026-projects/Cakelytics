// // const { OrderService, buildOrderPayload } = require('../../../src/services/orderingServices/order.service');
// // const { OrderModel } = require('../../../src/model/orderingModels/order.model');
// // const { CustomerService } = require('../../../src/services/orderingServices/customer.service');
// // const { OrderItemService } = require('../../../src/services/orderingServices/orderItem.service');

// // describe('Ordering OrderService', () => {
// //   beforeEach(() => {
// //     vi.restoreAllMocks();
// //   });

// //   it('should build an order payload with defaults', () => {
// //     expect(buildOrderPayload({ subtotal: 100, grand_total: 100 })).toEqual(expect.objectContaining({
// //       order_number: '',
// //       customer_id: null,
// //       order_type: 'Pre-Order',
// //       source: 'walk-in',
// //       status: 'Confirmed',
// //       subtotal: 100,
// //       grand_total: 100,
// //       payment_type: 'full',
// //       special_instructions: '',
// //     }));
// //   });

// //   it('should return orders', async () => {
// //     const orders = [{ id: 'o-1', order_number: 'ORD-0001' }];
// //     vi.spyOn(OrderModel, 'findAll').mockResolvedValue({ data: orders, error: null });

// //     const result = await OrderService.getOrders({ status: 'Confirmed' });

// //     expect(OrderModel.findAll).toHaveBeenCalledWith({ status: 'Confirmed' });
// //     expect(result).toEqual(orders);
// //   });

// //   it('should create an order', async () => {
// //     vi.spyOn(OrderModel, 'create').mockResolvedValue({ data: { id: 'o-1' }, error: null });

// //     const result = await OrderService.createOrder({ customer_id: 'c-1', grand_total: 500 });

// //     expect(OrderModel.create).toHaveBeenCalledWith(expect.objectContaining({
// //       customer_id: 'c-1',
// //       grand_total: 500,
// //       source: 'walk-in',
// //     }));
// //     expect(result).toEqual({ id: 'o-1' });
// //   });

// //   it('should create an order with customer and items', async () => {
// //     vi.spyOn(CustomerService, 'createCustomer').mockResolvedValue({ id: 'c-1', name: 'Ana' });
// //     vi.spyOn(OrderService, 'createOrder').mockResolvedValue({ id: 'o-1', customer_id: 'c-1' });
// //     vi.spyOn(OrderItemService, 'createOrderItems').mockResolvedValue([{ id: 'oi-1' }]);

// //     const result = await OrderService.createOrderWithItems({
// //       customer: { name: 'Ana', phone: '0917' },
// //       items: [{ product_name: 'Cake', quantity: 1, unit_price: 500 }],
// //     });

// //     expect(CustomerService.createCustomer).toHaveBeenCalledWith({ name: 'Ana', phone: '0917' });
// //     expect(OrderService.createOrder).toHaveBeenCalledWith(expect.objectContaining({ customer_id: 'c-1' }));
// //     expect(OrderItemService.createOrderItems).toHaveBeenCalledWith([
// //       expect.objectContaining({ order_id: 'o-1', product_name: 'Cake' }),
// //     ]);
// //     expect(result.order_items).toEqual([{ id: 'oi-1' }]);
// //   });

// //   it('should throw when the model returns an error', async () => {
// //     const error = new Error('Order failed');
// //     vi.spyOn(OrderModel, 'findById').mockResolvedValue({ data: null, error });

// //     await expect(OrderService.getOrderById('o-1')).rejects.toThrow(error);
// //   });
// // });

// //const { describe, it, expect, beforeEach, vi } = require('vitest');

// const { OrderService } = require('../../../src/services/orderingServices/order.service');
// const { OrderModel } = require('../../../src/model/orderingModels/order.model');
// const { CustomerService } = require('../../../src/services/orderingServices/customer.service');
// const { OrderItemService } = require('../../../src/services/orderingServices/orderItem.service');

// describe('OrderService', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();

//     OrderModel.findAll = vi.fn();
//     OrderModel.findById = vi.fn();
//     OrderModel.create = vi.fn();
//     OrderModel.update = vi.fn();
//     OrderModel.updateStatus = vi.fn();
//     OrderModel.remove = vi.fn();

//     CustomerService.createCustomer = vi.fn();
//     OrderItemService.createOrderItems = vi.fn();
//   });

//   describe('getOrders()', () => {
//     it('should return all fetched orders from the model layer', async () => {
//       const mockOrders = [
//         {
//           id: 'o-1',
//           order_number: 'ORD-001',
//         },
//       ];

//       OrderModel.findAll.mockResolvedValue({
//         data: mockOrders,
//         error: null,
//       });

//       const result = await OrderService.getOrders({
//         search: 'ORD',
//       });

//       expect(OrderModel.findAll).toHaveBeenCalledWith({
//         search: 'ORD',
//       });

//       expect(result).toEqual(mockOrders);
//     });
//   });

//   describe('getOrderById()', () => {
//     it('should forward a valid payload and extract single data row on findById', async () => {
//       const mockOrder = {
//         id: 'o-1',
//         order_number: 'ORD-001',
//       };

//       OrderModel.findById.mockResolvedValue({
//         data: mockOrder,
//         error: null,
//       });

//       const result = await OrderService.getOrderById('o-1');

//       expect(OrderModel.findById).toHaveBeenCalledWith('o-1');
//       expect(result).toEqual(mockOrder);
//     });
//   });

//   describe('createOrder()', () => {
//     it('should map input payloads to exact structural schema fields on createOrder', async () => {
//       const input = {
//         order_number: 'ORD-123',
//         subtotal: 100,
//       };

//       const mockCreated = {
//         id: 'o-1',
//         ...input,
//       };

//       OrderModel.create.mockResolvedValue({
//         data: mockCreated,
//         error: null,
//       });

//       const result = await OrderService.createOrder(input);

//       expect(OrderModel.create).toHaveBeenCalledWith(
//         expect.objectContaining({
//           order_number: 'ORD-123',
//           order_type: 'Pre-Order',
//           status: 'Confirmed',
//           subtotal: 100,
//         })
//       );

//       expect(result).toEqual(mockCreated);
//     });
//   });

//   describe('createOrderWithItems()', () => {
//     it('should perform deep cascade orchestration inside createOrderWithItems', async () => {
//       const complexBody = {
//         order_number: 'ORD-COMPLEX',
//         customer: {
//           name: 'Juan',
//         },
//         items: [
//           {
//             product_id: 'p-1',
//             quantity: 2,
//           },
//         ],
//       };

//       CustomerService.createCustomer.mockResolvedValue({
//         id: 'c-Juan',
//         name: 'Juan',
//       });

//       OrderModel.create.mockResolvedValue({
//         data: {
//           id: 'o-complex',
//           order_number: 'ORD-COMPLEX',
//         },
//         error: null,
//       });

//       OrderItemService.createOrderItems.mockResolvedValue([
//         {
//           id: 'oi-1',
//           order_id: 'o-complex',
//         },
//       ]);

//       const result = await OrderService.createOrderWithItems(complexBody);

//       expect(CustomerService.createCustomer).toHaveBeenCalledWith({
//         name: 'Juan',
//       });

//       expect(OrderItemService.createOrderItems).toHaveBeenCalled();

//       expect(result.customer).toEqual({
//         id: 'c-Juan',
//         name: 'Juan',
//       });

//       expect(result.order_items).toHaveLength(1);
//     });
//   });

//   describe('updateOrder()', () => {
//     it('should parse body updates conditionally and only supply modified rows to model', async () => {
//       const inputFields = {
//         status: 'Ready',
//         grand_total: 700,
//       };

//       const mockUpdated = {
//         id: 'o-1',
//         status: 'Ready',
//         grand_total: 700,
//       };

//       OrderModel.update.mockResolvedValue({
//         data: mockUpdated,
//         error: null,
//       });

//       const result = await OrderService.updateOrder(
//         'o-1',
//         inputFields
//       );

//       expect(OrderModel.update).toHaveBeenCalledWith(
//         'o-1',
//         {
//           status: 'Ready',
//           grand_total: 700,
//         }
//       );

//       expect(result).toEqual(mockUpdated);
//     });
//   });

//   describe('updateOrderStatus()', () => {
//     it('should direct updates targeting status field exclusively on updateOrderStatus', async () => {
//       const mockUpdated = {
//         id: 'o-1',
//         status: 'Completed',
//       };

//       OrderModel.updateStatus.mockResolvedValue({
//         data: mockUpdated,
//         error: null,
//       });

//       const result = await OrderService.updateOrderStatus(
//         'o-1',
//         'Completed'
//       );

//       expect(OrderModel.updateStatus).toHaveBeenCalledWith(
//         'o-1',
//         'Completed'
//       );

//       expect(result).toEqual(mockUpdated);
//     });
//   });

//   describe('deleteOrder()', () => {
//     it('should capture response payload safely returning mapped reference object on deleteOrder', async () => {
//       OrderModel.remove.mockResolvedValue({
//         error: null,
//       });

//       const result = await OrderService.deleteOrder('o-1');

//       expect(OrderModel.remove).toHaveBeenCalledWith('o-1');

//       expect(result).toEqual({
//         id: 'o-1',
//       });
//     });
//   });
// });

const { OrderService } = require('../../../src/services/orderingServices/order.service');
const { OrderModel } = require('../../../src/model/orderingModels/order.model');
const { CustomerService } = require('../../../src/services/orderingServices/customer.service');
const { OrderItemService } = require('../../../src/services/orderingServices/orderItem.service');

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    OrderModel.findAll = vi.fn();
    OrderModel.findById = vi.fn();
    OrderModel.create = vi.fn();
    OrderModel.update = vi.fn();
    OrderModel.updateStatus = vi.fn();
    OrderModel.remove = vi.fn();

    CustomerService.createCustomer = vi.fn();
    OrderItemService.createOrderItems = vi.fn();
  });

  describe('getOrders()', () => {

    describe('when filters are provided', () => {

      it('should return matching orders', async () => {
        const mockOrders = [
          {
            id: 'o-1',
            order_number: 'ORD-001',
          },
        ];

        OrderModel.findAll.mockResolvedValue({
          data: mockOrders,
          error: null,
        });

        const result = await OrderService.getOrders({
          search: 'ORD',
        });

        expect(OrderModel.findAll).toHaveBeenCalledWith({
          search: 'ORD',
        });

        expect(result).toEqual(mockOrders);
      });

    });

    describe('when no filters are provided', () => {

      it('should return all orders', async () => {
        const mockOrders = [
          {
            id: 'o-1',
          },
        ];

        OrderModel.findAll.mockResolvedValue({
          data: mockOrders,
          error: null,
        });

        const result = await OrderService.getOrders();

        expect(OrderModel.findAll).toHaveBeenCalledWith({});
        expect(result).toEqual(mockOrders);
      });

    });

    describe('when the model returns an error', () => {

      it('should throw the returned error', async () => {
        const error = new Error('Failed to retrieve orders');

        OrderModel.findAll.mockResolvedValue({
          data: null,
          error,
        });

        await expect(
          OrderService.getOrders({})
        ).rejects.toThrow(error);
      });

    });

  });

  describe('getOrderById()', () => {

    describe('when the order exists', () => {

      it('should return the requested order', async () => {
        const mockOrder = {
          id: 'o-1',
          order_number: 'ORD-001',
        };

        OrderModel.findById.mockResolvedValue({
          data: mockOrder,
          error: null,
        });

        const result = await OrderService.getOrderById('o-1');

        expect(OrderModel.findById).toHaveBeenCalledWith('o-1');
        expect(result).toEqual(mockOrder);
      });

    });

    describe('when the order does not exist', () => {

      it('should throw the returned error', async () => {
        const error = new Error('Order not found');

        OrderModel.findById.mockResolvedValue({
          data: null,
          error,
        });

        await expect(
          OrderService.getOrderById('o-1')
        ).rejects.toThrow(error);
      });

    });

  });

  describe('createOrder()', () => {

    describe('when optional fields are omitted', () => {

      it('should apply default values before creating the order', async () => {
        const input = {
          order_number: 'ORD-123',
          subtotal: 100,
        };

        const mockCreated = {
          id: 'o-1',
          ...input,
        };

        OrderModel.create.mockResolvedValue({
          data: mockCreated,
          error: null,
        });

        const result = await OrderService.createOrder(input);

        expect(OrderModel.create).toHaveBeenCalledWith(
          expect.objectContaining({
            order_number: 'ORD-123',
            order_type: 'Pre-Order',
            source: 'walk-in',
            status: 'Confirmed',
            subtotal: 100,
          })
        );

        expect(result).toEqual(mockCreated);
      });

    });

    describe('when all order fields are provided', () => {

      it('should preserve the supplied order values', async () => {
        const input = {
          order_number: 'ORD-200',
          customer_id: 'c-1',
          order_type: 'Pre-Order',
          source: 'online',
          status: 'Pending',
          subtotal: 500,
          grand_total: 550,
          payment_type: 'full',
          amount_paid: 550,
          balance: 0,
          pickup_date: '2026-07-08',
          pickup_time: '10:00',
        };

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-2',
            ...input,
          },
          error: null,
        });

        const result = await OrderService.createOrder(input);

        expect(OrderModel.create).toHaveBeenCalled();

        expect(result).toEqual({
          id: 'o-2',
          ...input,
        });
      });

    });

    describe('when the model returns an error', () => {

      it('should throw the returned error', async () => {
        const error = new Error('Create failed');

        OrderModel.create.mockResolvedValue({
          data: null,
          error,
        });

        await expect(
          OrderService.createOrder({
            order_number: 'ORD-500',
          })
        ).rejects.toThrow(error);
      });

    });

  });

    describe('createOrderWithItems()', () => {

    describe('when customer information is provided', () => {

      it('should create a new customer before creating the order', async () => {
        CustomerService.createCustomer.mockResolvedValue({
          id: 'c-1',
          name: 'Juan',
        });

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
            order_number: 'ORD-001',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([]);

        await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
          customer: {
            name: 'Juan',
          },
          items: [],
        });

        expect(CustomerService.createCustomer).toHaveBeenCalledWith({
          name: 'Juan',
        });
      });

    });

    describe('when customer information is not provided', () => {

      it('should skip customer creation', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
        });

        expect(CustomerService.createCustomer).not.toHaveBeenCalled();
      });

    });

    describe('when order items are provided', () => {

      it('should create all order items', async () => {
        CustomerService.createCustomer.mockResolvedValue({
          id: 'c-1',
        });

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([
          {
            id: 'oi-1',
          },
        ]);

        await OrderService.createOrderWithItems({
          customer: {
            name: 'Juan',
          },
          items: [
            {
              product_id: 'p-1',
              quantity: 2,
            },
          ],
        });

        expect(OrderItemService.createOrderItems).toHaveBeenCalledWith([
          expect.objectContaining({
            order_id: 'o-1',
            product_id: 'p-1',
            quantity: 2,
          }),
        ]);
      });

    });

    describe('when no order items are provided', () => {

      it('should return an empty order_items array', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        const result = await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
          items: [],
        });

        expect(OrderItemService.createOrderItems).not.toHaveBeenCalled();

        expect(result.order_items).toEqual([]);
      });

    });

    describe('when customer and order items are successfully created', () => {

      it('should return the complete order response', async () => {
        CustomerService.createCustomer.mockResolvedValue({
          id: 'c-1',
          name: 'Juan',
        });

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
            order_number: 'ORD-001',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([
          {
            id: 'oi-1',
          },
        ]);

        const result = await OrderService.createOrderWithItems({
          customer: {
            name: 'Juan',
          },
          items: [
            {
              product_id: 'p-1',
            },
          ],
        });

        expect(result.customer).toEqual({
          id: 'c-1',
          name: 'Juan',
        });

        expect(result.order_items).toHaveLength(1);

        expect(result.order_number).toBe('ORD-001');
      });

    });

    describe('when order creation fails', () => {

      it('should throw the returned error', async () => {
        const error = new Error('Unable to create order');

        OrderModel.create.mockResolvedValue({
          data: null,
          error,
        });

        await expect(
          OrderService.createOrderWithItems({
            order_number: 'ORD-001',
          })
        ).rejects.toThrow(error);
      });

    });

  });

    describe('createOrderWithItems()', () => {
    describe('when customer information is provided', () => {
      it('should create a customer before creating the order', async () => {
        CustomerService.createCustomer.mockResolvedValue({
          id: 'c-1',
          name: 'Juan',
        });

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([]);

        await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
          customer: {
            name: 'Juan',
          },
          items: [],
        });

        expect(CustomerService.createCustomer).toHaveBeenCalledWith({
          name: 'Juan',
        });
      });

      it('should use the newly created customer id when creating the order', async () => {
        CustomerService.createCustomer.mockResolvedValue({
          id: 'c-100',
        });

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([]);

        await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
          customer: {
            name: 'Juan',
          },
        });

        expect(OrderModel.create).toHaveBeenCalledWith(
          expect.objectContaining({
            customer_id: 'c-100',
          })
        );
      });
    });

    describe('when customer information is not provided', () => {
      it('should skip customer creation', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
        });

        expect(CustomerService.createCustomer).not.toHaveBeenCalled();
      });

      it('should use the supplied customer_id', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        await OrderService.createOrderWithItems({
          order_number: 'ORD-001',
          customer_id: 'existing-customer',
        });

        expect(OrderModel.create).toHaveBeenCalledWith(
          expect.objectContaining({
            customer_id: 'existing-customer',
          })
        );
      });
    });

    describe('when order items are provided', () => {
      it('should create all order items after creating the order', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([
          {
            id: 'oi-1',
          },
        ]);

        await OrderService.createOrderWithItems({
          items: [
            {
              product_id: 'p-1',
              quantity: 2,
            },
          ],
        });

        expect(OrderItemService.createOrderItems).toHaveBeenCalledWith([
          expect.objectContaining({
            order_id: 'o-1',
            product_id: 'p-1',
            quantity: 2,
          }),
        ]);
      });

      it('should attach the created order id to every order item', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'order-123',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([]);

        await OrderService.createOrderWithItems({
          items: [
            {
              product_name: 'Chocolate Cake',
            },
          ],
        });

        expect(OrderItemService.createOrderItems).toHaveBeenCalledWith([
          expect.objectContaining({
            order_id: 'order-123',
          }),
        ]);
      });
    });

    describe('when no order items are provided', () => {
      it('should not create order items', async () => {
        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        const result = await OrderService.createOrderWithItems({
          items: [],
        });

        expect(OrderItemService.createOrderItems).not.toHaveBeenCalled();
        expect(result.order_items).toEqual([]);
      });
    });

    describe('when the process completes successfully', () => {
      it('should return the created order together with its customer and order items', async () => {
        CustomerService.createCustomer.mockResolvedValue({
          id: 'c-1',
          name: 'Juan',
        });

        OrderModel.create.mockResolvedValue({
          data: {
            id: 'o-1',
            order_number: 'ORD-001',
          },
          error: null,
        });

        OrderItemService.createOrderItems.mockResolvedValue([
          {
            id: 'oi-1',
          },
        ]);

        const result = await OrderService.createOrderWithItems({
          customer: {
            name: 'Juan',
          },
          items: [
            {
              product_id: 'p-1',
            },
          ],
        });

        expect(result.customer).toEqual({
          id: 'c-1',
          name: 'Juan',
        });

        expect(result.order_items).toHaveLength(1);
      });
    });
  });

  describe('updateOrder()', () => {
    describe('when selected fields are updated', () => {
      it('should update only the provided fields', async () => {
        OrderModel.update.mockResolvedValue({
          data: {
            id: 'o-1',
            status: 'Ready',
            grand_total: 700,
          },
          error: null,
        });

        const result = await OrderService.updateOrder('o-1', {
          status: 'Ready',
          grand_total: 700,
        });

        expect(OrderModel.update).toHaveBeenCalledWith('o-1', {
          status: 'Ready',
          grand_total: 700,
        });

        expect(result.status).toBe('Ready');
      });

      it('should convert numeric values before sending them to the model', async () => {
        OrderModel.update.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        await OrderService.updateOrder('o-1', {
          subtotal: '100',
          grand_total: '150',
          balance: '50',
        });

        expect(OrderModel.update).toHaveBeenCalledWith(
          'o-1',
          expect.objectContaining({
            subtotal: 100,
            grand_total: 150,
            balance: 50,
          })
        );
      });

      it('should convert empty optional values into null when necessary', async () => {
        OrderModel.update.mockResolvedValue({
          data: {
            id: 'o-1',
          },
          error: null,
        });

        await OrderService.updateOrder('o-1', {
          customer_id: '',
          pickup_date: '',
        });

        expect(OrderModel.update).toHaveBeenCalledWith(
          'o-1',
          expect.objectContaining({
            customer_id: null,
            pickup_date: null,
          })
        );
      });
    });
  });

  describe('updateOrderStatus()', () => {
    describe('when a new status is provided', () => {
      it('should update only the order status', async () => {
        OrderModel.updateStatus.mockResolvedValue({
          data: {
            id: 'o-1',
            status: 'Completed',
          },
          error: null,
        });

        const result = await OrderService.updateOrderStatus(
          'o-1',
          'Completed'
        );

        expect(OrderModel.updateStatus).toHaveBeenCalledWith(
          'o-1',
          'Completed'
        );

        expect(result.status).toBe('Completed');
      });
    });
  });

  describe('deleteOrder()', () => {
    describe('when the order exists', () => {
      it('should delete the specified order', async () => {
        OrderModel.remove.mockResolvedValue({
          error: null,
        });

        const result = await OrderService.deleteOrder('o-1');

        expect(OrderModel.remove).toHaveBeenCalledWith('o-1');

        expect(result).toEqual({
          id: 'o-1',
        });
      });
    });

    describe('when the model returns an error', () => {
      it('should throw the returned error', async () => {
        const error = new Error('Delete failed');

        OrderModel.remove.mockResolvedValue({
          error,
        });

        await expect(
          OrderService.deleteOrder('o-1')
        ).rejects.toThrow(error);
      });
    });
  });
});
