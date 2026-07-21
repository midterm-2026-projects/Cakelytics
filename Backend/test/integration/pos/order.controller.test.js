const orderServiceModule = require('../../../src/services/orders.service');

// "Integration" here means end-to-end mocking of the service layer so we
// validate the controller composes filters, status codes, and response
// shapes correctly. It avoids any real DB / HTTP dependency.
orderServiceModule.OrderService = {
  getAllOrders: vi.fn(),
  getOrderById: vi.fn(),
  createOrder: vi.fn(),
  createOrderWithItems: vi.fn(),
  updateStatus: vi.fn(),
};

const orderController = require('../../../src/controller/order.controller');
const { OrderService } = orderServiceModule;

function buildRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe('Order Controller Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      query: {},
      params: {},
      body: {},
    };

    res = buildRes();

    next = vi.fn();
  });

  // ==========================================
  // 1. getAllOrders
  // ==========================================
  describe('getAllOrders', () => {
    it('should return 200 with list of orders', async () => {
      const mockOrders = [{ id: '1', order_number: 'ORD-001' }];
      OrderService.getAllOrders.mockResolvedValue(mockOrders);

      req.query = { status: 'Pending' };

      await orderController.getAllOrders(req, res, next);

      expect(OrderService.getAllOrders).toHaveBeenCalledWith({ status: 'Pending' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) if OrderService throws an error', async () => {
      const error = new Error('Database connection failed');
      OrderService.getAllOrders.mockRejectedValue(error);

      await orderController.getAllOrders(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ==========================================
  // 2. getOrderById
  // ==========================================
  describe('getOrderById', () => {
    it('should return 200 and the order data if found', async () => {
      const mockOrder = { id: '00000000-0000-0000-0000-000000000000', status: 'Pending' };
      OrderService.getOrderById.mockResolvedValue(mockOrder);

      req.params.id = '00000000-0000-0000-0000-000000000000';

      await orderController.getOrderById(req, res, next);

      expect(OrderService.getOrderById).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000000');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrder,
      });
    });

    it('should return 404 if order is not found', async () => {
      OrderService.getOrderById.mockResolvedValue(null);

      req.params.id = 'non-existent-id';

      await orderController.getOrderById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Order not found',
      });
    });

    it('should call next(err) when exception occurs', async () => {
      const error = new Error('DB Error');
      OrderService.getOrderById.mockRejectedValue(error);

      req.params.id = 'fake-id';

      await orderController.getOrderById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ==========================================
  // 3. createOrder
  // ==========================================
  describe('createOrder', () => {
    it('should return 400 if items/cartItems are present but pickup_date or pickup_time is missing', async () => {
      req.body = {
        items: [{ product_id: '123', quantity: 1 }],
        pickup_date: '2026-07-25',
        // missing pickup_time
      };

      await orderController.createOrder(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'pickup_date and pickup_time are required',
      });
    });

    it('should create an order with items via createOrderWithItems and return 201', async () => {
      req.body = {
        order_number: 'ORD-100',
        customer_name: 'Juan Dela Cruz',
        pickup_date: '2026-07-25',
        pickup_time: '14:00',
        items: [{ product_id: 'prod-1', quantity: 2 }],
      };

      const mockCreatedOrder = { id: 'order-uuid', order_number: 'ORD-100' };
      OrderService.createOrderWithItems.mockResolvedValue(mockCreatedOrder);

      await orderController.createOrder(req, res, next);

      expect(OrderService.createOrderWithItems).toHaveBeenCalledWith(
        expect.objectContaining({
          order_number: 'ORD-100',
          customer_name: 'Juan Dela Cruz',
          pickup_date: '2026-07-25',
          pickup_time: '14:00',
          order_type: 'Pre-Order',
          source: 'online',
          status: 'Confirmed',
          items: [{ product_id: 'prod-1', quantity: 2 }],
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedOrder,
      });
    });

    it('should fallback to direct createOrder when no items/cartItems provided and return 201', async () => {
      req.body = {
        order_type: 'Direct',
        total_amount: 500,
      };

      const mockCreatedOrder = { id: 'direct-order-uuid', total_amount: 500 };
      OrderService.createOrder.mockResolvedValue(mockCreatedOrder);

      await orderController.createOrder(req, res, next);

      expect(OrderService.createOrder).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedOrder,
      });
    });

    it('should catch error and call next(err)', async () => {
      req.body = {};
      const error = new Error('Failed to create order');
      OrderService.createOrder.mockRejectedValue(error);

      await orderController.createOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ==========================================
  // 4. updateStatus
  // ==========================================
  describe('updateStatus', () => {
    it('should return 400 if orderId is missing', async () => {
      req.body = { status: 'Completed' };

      await orderController.updateStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'orderId is required',
      });
    });

    it('should return 400 if status is missing', async () => {
      req.params.id = '00000000-0000-0000-0000-000000000000';

      await orderController.updateStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'status is required',
      });
    });

    it('should update status successfully and return 200', async () => {
      req.params.id = '00000000-0000-0000-0000-000000000000';
      req.body = { status: 'Completed' };

      const mockUpdatedOrder = { id: req.params.id, status: 'Completed' };
      OrderService.updateStatus.mockResolvedValue(mockUpdatedOrder);

      await orderController.updateStatus(req, res, next);

      expect(OrderService.updateStatus).toHaveBeenCalledWith(
        '00000000-0000-0000-0000-000000000000',
        'Completed'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Order status updated successfully',
        data: mockUpdatedOrder,
      });
    });

    it('should call next(err) when OrderService.updateStatus fails', async () => {
      req.params.id = 'fake-id';
      req.body = { status: 'Cancelled' };

      const error = new Error('Update failed');
      OrderService.updateStatus.mockRejectedValue(error);

      await orderController.updateStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

