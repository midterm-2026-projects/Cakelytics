const { supabase } = require('../../../src/config/supabase');
const { CustomerModel } = require('../../../src/model/customer.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: { id: 'mock-id' },
      error: null,
    }),
  };
}

describe('CustomerModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.from = vi.fn();
  });

  describe('findAll()', () => {
    it('should find all customers with search filter', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.findAll({ search: 'Ana' });

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
      expect(query.or).toHaveBeenCalledWith(
        'name.ilike.%Ana%,phone.ilike.%Ana%,email.ilike.%Ana%'
      );
    });

    it('should query all customers in default chronological order if no filters are provided', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.findAll();

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');
      expect(query.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
      expect(query.or).not.toHaveBeenCalled();
    });
  });

  describe('findById()', () => {
    it('should find a customer by id', async () => {
      const customer = {
        id: 'c-1',
        name: 'Ana',
      };

      const query = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: customer,
          error: null,
        }),
      };

      supabase.from.mockReturnValue(query);

      await CustomerModel.findById('c-1');

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.select).toHaveBeenCalledWith('*');

      // Change 'id' to 'customer_id' if that's what your model uses
      expect(query.eq).toHaveBeenCalledWith('id', 'c-1');

      expect(query.maybeSingle).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create a customer', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      const payload = {
        name: 'Ana',
      };

      await CustomerModel.create(payload);

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.insert).toHaveBeenCalledWith(payload);
      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    it('should update a customer', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.update('c-1', {
        phone: '09171234567',
      });

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.update).toHaveBeenCalledWith({
        phone: '09171234567',
      });

      // Change 'id' to 'customer_id' if your model uses customer_id
      expect(query.eq).toHaveBeenCalledWith('id', 'c-1');

      expect(query.single).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should delete a customer', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.remove('c-1');

      expect(supabase.from).toHaveBeenCalledWith('customers');
      expect(query.delete).toHaveBeenCalled();

      // Change 'id' to 'customer_id' if your model uses customer_id
      expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
    });

    it('should not chain a single modifier on removal action context', async () => {
      const query = buildQueryChain();
      supabase.from.mockReturnValue(query);

      await CustomerModel.remove('c-1');

      expect(query.single).not.toHaveBeenCalled();
    });
  });
});
