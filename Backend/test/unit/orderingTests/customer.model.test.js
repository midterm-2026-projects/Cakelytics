const { supabase } = require('../../../src/config/supabase');
const { CustomerModel } = require('../../../src/model/orderingModels/customer.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('Ordering CustomerModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabase.from = vi.fn();
  });

  it('should find all customers with search filter', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await CustomerModel.findAll({ search: 'Ana' });

    expect(supabase.from).toHaveBeenCalledWith('customers');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(query.or).toHaveBeenCalledWith('name.ilike.%Ana%,phone.ilike.%Ana%,email.ilike.%Ana%');
  });

  it('should find a customer by id', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await CustomerModel.findById('c-1');

    expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('should create, update, and delete customers', async () => {
    const query = buildQueryChain();
    supabase.from.mockReturnValue(query);

    await CustomerModel.create({ name: 'Ana' });
    await CustomerModel.update('c-1', { phone: '0917' });
    await CustomerModel.remove('c-1');

    expect(query.insert).toHaveBeenCalledWith({ name: 'Ana' });
    expect(query.update).toHaveBeenCalledWith({ phone: '0917' });
    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('id', 'c-1');
  });
});