const customerServiceModule = require('../../../src/services/customer.service');

// "Integration" here means end-to-end mocking of the service layer so we
// validate the controller composes calls, status codes, and response
// shapes correctly. It avoids any real DB / HTTP dependency.
customerServiceModule.CustomerService = {
  getAllCustomers: vi.fn(),
  getCustomerById: vi.fn(),
  createCustomer: vi.fn(),
  verifyOrderAndCustomer: vi.fn(),
};

const customerController = require('../../../src/controller/customer.controller');
const { CustomerService } = customerServiceModule;

function buildRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe('customerController (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCustomers', () => {
    it('returns 200 with the customer list on success', async () => {
      const customers = [{ id: 'c-1', name: 'Ana' }];
      CustomerService.getAllCustomers.mockResolvedValue(customers);

      const req = { query: { search: 'Ana' } };
      const res = buildRes();

      await customerController.getAllCustomers(req, res);

      expect(CustomerService.getAllCustomers).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: customers });
    });

    it('returns 500 when the service throws', async () => {
      CustomerService.getAllCustomers.mockRejectedValue(new Error('DB down'));

      const req = { query: {} };
      const res = buildRes();

      await customerController.getAllCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'DB down' });
    });
  });

  describe('getCustomerById', () => {
    it('returns 200 with the customer when found', async () => {
      const customer = { id: 'c-1', name: 'Ana' };
      CustomerService.getCustomerById.mockResolvedValue(customer);

      const req = { params: { id: 'c-1' } };
      const res = buildRes();

      await customerController.getCustomerById(req, res);

      expect(CustomerService.getCustomerById).toHaveBeenCalledWith('c-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: customer });
    });

    it('returns 404 when the customer is not found', async () => {
      CustomerService.getCustomerById.mockResolvedValue(null);

      const req = { params: { id: 'missing-id' } };
      const res = buildRes();

      await customerController.getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Customer not found' });
    });

    it('returns 500 when the service throws', async () => {
      CustomerService.getCustomerById.mockRejectedValue(new Error('DB down'));

      const req = { params: { id: 'c-1' } };
      const res = buildRes();

      await customerController.getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'DB down' });
    });
  });

  describe('createCustomer', () => {
    it('returns 400 when name is missing', async () => {
      const req = { body: { phone: '0917' } };
      const res = buildRes();

      await customerController.createCustomer(req, res);

      expect(CustomerService.createCustomer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name and phone number are required fields!',
      });
    });

    it('returns 400 when phone is missing', async () => {
      const req = { body: { name: 'Ana' } };
      const res = buildRes();

      await customerController.createCustomer(req, res);

      expect(CustomerService.createCustomer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 201 with the created customer on success', async () => {
      const body = { name: 'Ana', phone: '0917' };
      const created = { id: 'c-1', ...body };
      CustomerService.createCustomer.mockResolvedValue(created);

      const req = { body };
      const res = buildRes();

      await customerController.createCustomer(req, res);

      expect(CustomerService.createCustomer).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: created });
    });

    it('returns 400 when the service throws', async () => {
      CustomerService.createCustomer.mockRejectedValue(new Error('duplicate phone'));

      const req = { body: { name: 'Ana', phone: '0917' } };
      const res = buildRes();

      await customerController.createCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'duplicate phone' });
    });
  });

  describe('verifyCustomerAndOrder', () => {
    it('returns 400 when order_ref is missing', async () => {
      const req = { query: { phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(CustomerService.verifyOrderAndCustomer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'order_ref and phone are required query params',
      });
    });

    it('returns 400 when phone is missing', async () => {
      const req = { query: { order_ref: 'ORD-1' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(CustomerService.verifyOrderAndCustomer).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 500 when verification result carries an error', async () => {
      CustomerService.verifyOrderAndCustomer.mockResolvedValue({
        data: null,
        error: { message: 'Supabase timeout' },
      });

      const req = { query: { order_ref: 'ORD-1', phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(CustomerService.verifyOrderAndCustomer).toHaveBeenCalledWith('ORD-1', '0917');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Supabase timeout' });
    });

    it('returns 500 with a fallback message when the error has no message', async () => {
      CustomerService.verifyOrderAndCustomer.mockResolvedValue({
        data: null,
        error: {},
      });

      const req = { query: { order_ref: 'ORD-1', phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Verification failed' });
    });

    it('returns 400 with the reason when no match is found', async () => {
      CustomerService.verifyOrderAndCustomer.mockResolvedValue({
        data: null,
        error: null,
        reason: 'phone does not match order',
      });

      const req = { query: { order_ref: 'ORD-1', phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'phone does not match order',
      });
    });

    it('returns 400 with a fallback message when no match is found and no reason given', async () => {
      CustomerService.verifyOrderAndCustomer.mockResolvedValue({
        data: null,
        error: null,
      });

      const req = { query: { order_ref: 'ORD-1', phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Verification failed' });
    });

    it('returns 200 with the verification data on success', async () => {
      const data = { customer_id: 'c-1', order_id: 'o-1' };
      CustomerService.verifyOrderAndCustomer.mockResolvedValue({ data, error: null });

      const req = { query: { order_ref: 'ORD-1', phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data });
    });

    it('returns 500 when the service call itself throws', async () => {
      CustomerService.verifyOrderAndCustomer.mockRejectedValue(new Error('unexpected'));

      const req = { query: { order_ref: 'ORD-1', phone: '0917' } };
      const res = buildRes();

      await customerController.verifyCustomerAndOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'unexpected' });
    });
  });
});