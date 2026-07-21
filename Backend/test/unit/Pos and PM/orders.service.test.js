// Import real modules
const { OrderService } = require('../../../src/services/orders.service');
const OrdersModelModule = require('../../../src/model/orders.model');
const OrderItemsModelModule = require('../../../src/model/orderItems.model');
const SalesServiceModule = require('../../../src/services/sales.service');

const OrdersModel = OrdersModelModule.OrdersModel || OrdersModelModule;

// Fixed module unwrapping for OrderItemsModel to prevent undefined property errors
const OrderItemsModel = 
  OrderItemsModelModule.OrderItemsModel || 
  OrderItemsModelModule.default || 
  OrderItemsModelModule;

const SalesService = SalesServiceModule.SalesService || SalesServiceModule;

describe('OrderService - Unit Tests (Vitest)', () => {
  
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    // Freeze time to ensure consistent `Date.now()` and ISO string generation
    vi.setSystemTime(new Date('2026-07-17T01:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getAllOrders / getOrders', () => {
    it('should successfully return the list of orders from OrdersModel.findAll', async () => {
      const mockData = [{ id: '1', order_number: 'ORD-123' }];
      vi.spyOn(OrdersModel, 'findAll').mockResolvedValue(mockData);

      const result = await OrderService.getAllOrders({ status: 'Pending' });

      expect(OrdersModel.findAll).toHaveBeenCalledWith({ status: 'Pending' });
      expect(result).toEqual(mockData);
    });

    it('should throw an error when database query fails in getAllOrders', async () => {
      vi.spyOn(OrdersModel, 'findAll').mockRejectedValue(new Error('Connection timeout'));

      await expect(OrderService.getAllOrders()).rejects.toThrow('Connection timeout');
    });

    it('should run correctly when using getOrders as an alias of getAllOrders', async () => {
      const mockData = [{ id: '2', order_number: 'ORD-456' }];
      vi.spyOn(OrdersModel, 'findAll').mockResolvedValue(mockData);

      const result = await OrderService.getOrders({ status: 'Completed' });

      expect(OrdersModel.findAll).toHaveBeenCalledWith({ status: 'Completed' });
      expect(result).toEqual(mockData);
    });
  });

  describe('getOrderById', () => {
    it('should return the order record when a matching ID is found', async () => {
      const mockData = { id: 'uuid-1', order_number: 'ORD-789' };
      vi.spyOn(OrdersModel, 'findById').mockResolvedValue({ data: mockData, error: null });

      const result = await OrderService.getOrderById('uuid-1');

      expect(OrdersModel.findById).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(mockData);
    });

    it('should throw an error on database error or if no record is found', async () => {
      vi.spyOn(OrdersModel, 'findById').mockRejectedValue(new Error('Order not found'));

      await expect(OrderService.getOrderById('invalid-id')).rejects.toThrow('Order not found');
    });
  });

  describe('createOrder', () => {
    it('should create an order record with default values when the payload is empty', async () => {
      const mockSaved = { id: 'uuid-saved', order_number: 'ORD-1784246800000' };
      vi.spyOn(OrdersModel, 'create').mockResolvedValue({ data: mockSaved, error: null });

      const result = await OrderService.createOrder({});

      expect(OrdersModel.create).toHaveBeenCalledWith({
        order_number: '',
        customer_id: null,
        placed_by_admin: null,
        pickup_date: null,
        pickup_time: null,
        payment_type: 'full',
        amount_paid: 0,
        balance: 0,
        order_type: 'Pre-Order',
        source: 'walk-in',
        status: 'Confirmed',
        subtotal: 0,
        additional_charge: 0,
        discount: 0,
        grand_total: 0,
        special_instructions: '',
        customer_reference_url: null,
        paymongo_payment_id: null,
      });
      expect(result).toEqual({ ...mockSaved, customer_name: null, phone_number: null });
    });

    it('should support legacy additional_fee as a fallback for additional_charge', async () => {
      vi.spyOn(OrdersModel, 'create').mockResolvedValue({ data: { id: 'uuid-saved' }, error: null });

      await OrderService.createOrder({ additional_fee: 150 });

      expect(OrdersModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          additional_charge: 150,
        })
      );
    });
  });

  describe('completeOrder', () => {
    it('should throw an error when items is not a valid array', async () => {
      await expect(OrderService.completeOrder({ items: 'not-an-array' })).rejects.toThrow(
        'items must be an array'
      );
    });

    it('should successfully generate Order, Order Items, and trigger a SalesService record', async () => {
      const mockOrder = { id: 'new-order-id', grand_total: 1500 };
      const mockSaleResult = { id: 'new-sale-id' };

      vi.spyOn(OrdersModel, 'create').mockResolvedValue({ data: mockOrder, error: null });
      vi.spyOn(OrderItemsModel, 'createMany').mockResolvedValue({ error: null });
      vi.spyOn(SalesService, 'createSale').mockResolvedValue(mockSaleResult);

      const body = {
        items: [
          { product_id: 'p-1', name: 'Premium Cake', quantity: 1, price: 1500 }
        ],
        payment_type: 'Gcash',
        amount_paid: 1500,
        change_due: 0,
        subtotal: 1500,
        grand_total: 1500,
      };

      const result = await OrderService.completeOrder(body);

      expect(OrdersModel.create).toHaveBeenCalled();

      expect(OrderItemsModel.createMany).toHaveBeenCalledWith([
        {
          order_id: 'new-order-id',
          product_id: 'p-1',
          product_name: 'Premium Cake',
          quantity: 1,
          unit_price: 1500,
          total_price: 1500,
        }
      ]);

      expect(SalesService.createSale).toHaveBeenCalledWith({
        order_id: 'new-order-id',
        payment_method: 'Gcash',
        subtotal: 1500,
        additional_charge: 0,
        discount: undefined,
        grand_total: 1500,
        amount_paid: 1500,
        sale_number: undefined,
        items: [],
      });

      expect(result).toEqual({
        order: { ...mockOrder, customer_name: null, phone_number: null },
        sale: mockSaleResult
      });
    });
  });
});