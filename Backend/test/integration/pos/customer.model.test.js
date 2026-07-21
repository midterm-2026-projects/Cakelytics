const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();

// "Integration" here means end-to-end mocking of the Supabase query builder
// so we validate the model composes calls correctly.
// It avoids any real DB dependency.
supabaseModule.getSupabase = getSupabase;

const { CustomerModel } = require('../../../src/model/customer.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    // Allow awaiting on the chain (for verifyOrderAndCustomer internal awaits)
    then: vi.fn(function (resolve) {
      return resolve({ data: [{ id: 'c-1', customer_id: 'c-1' }], error: null });
    }),
  };
}

describe('CustomerModel (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll()', () => {
    it('selects all customers ordered by created_at descending', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await CustomerModel.findAll();

      expect(client.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(query.or).not.toHaveBeenCalled();
    });

    it('applies search filter via or() on name, phone, and email', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await CustomerModel.findAll({ search: 'Integration Test' });

      expect(client.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(query.or).toHaveBeenCalledWith(
        'name.ilike.%Integration Test%,phone.ilike.%Integration Test%,email.ilike.%Integration Test%'
      );
    });
  });

  describe('findById()', () => {
    it('selects a customer by id', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await CustomerModel.findById('customer-id-1');

      expect(client.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.eq).toHaveBeenCalledWith('id', 'customer-id-1');
      expect(query.maybeSingle).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('inserts a customer payload and returns the single row', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      const payload = { name: 'Test Customer', phone: '09171234567' };
      await CustomerModel.create(payload);

      expect(client.from).toHaveBeenCalledWith('customers');
      expect(query.insert).toHaveBeenCalledWith(payload);
      expect(query.select).toHaveBeenCalled();
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('updates a customer by id and returns the single row', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      const payload = { phone: '09998887777' };
      await CustomerModel.update('customer-id-1', payload);

      expect(client.from).toHaveBeenCalledWith('customers');
      expect(query.update).toHaveBeenCalledWith(payload);
      expect(query.eq).toHaveBeenCalledWith('id', 'customer-id-1');
      expect(query.select).toHaveBeenCalled();
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('deletes a customer by id', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await CustomerModel.remove('customer-id-1');

      expect(client.from).toHaveBeenCalledWith('customers');
      expect(query.delete).toHaveBeenCalled();
      expect(query.eq).toHaveBeenCalledWith('id', 'customer-id-1');
    });
  });

  describe('verifyOrderAndCustomer()', () => {
    it('queries customers by phone and orders by order_number for non-UUID ref', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await CustomerModel.verifyOrderAndCustomer('ORD-123', '09171234567');

      // First query: customers by phone
      expect(client.from).toHaveBeenNthCalledWith(1, 'customers');
      expect(query.select).toHaveBeenCalledWith('id, name, phone');
      expect(query.eq).toHaveBeenCalledWith('phone', '09171234567');
      expect(query.limit).toHaveBeenCalledWith(1);

      // Second query: orders by order_number
      expect(client.from).toHaveBeenNthCalledWith(2, 'orders');
      expect(query.select).toHaveBeenCalledWith(
        'id, order_number, grand_total, status, customer_id'
      );
      expect(query.eq).toHaveBeenCalledWith('order_number', 'ORD-123');
      expect(query.limit).toHaveBeenCalledWith(1);
    });

    it('queries orders by id when orderRef is a UUID', async () => {
      const query = buildQueryChain();
      const client = { from: vi.fn().mockReturnValue(query) };
      getSupabase.mockReturnValue(client);

      await CustomerModel.verifyOrderAndCustomer(
        '550e8400-e29b-41d4-a716-446655440000',
        '09171234567'
      );

      // First query: customers by phone
      expect(client.from).toHaveBeenNthCalledWith(1, 'customers');

      // Second query: orders by id (UUID)
      expect(client.from).toHaveBeenNthCalledWith(2, 'orders');
      expect(query.eq).toHaveBeenCalledWith('id', '550e8400-e29b-41d4-a716-446655440000');
    });
  });
});
