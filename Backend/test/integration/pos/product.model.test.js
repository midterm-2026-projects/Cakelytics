const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();

// "Integration" here means end-to-end mocking of the Supabase query builder
// so we validate the model composes calls correctly.
// It avoids any real DB dependency.
supabaseModule.getSupabase = getSupabase;

const { ProductModel } = require('../../../src/model/product.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('ProductModel (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('findAll applies category + search + activeOnly=true by default', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await ProductModel.findAll({ category: 'Cakes', search: 'ube' });

    expect(client.from).toHaveBeenCalledWith('products');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('name', { ascending: true });
    expect(query.eq).toHaveBeenCalledWith('category', 'Cakes');
    expect(query.ilike).toHaveBeenCalledWith('name', '%ube%');
    expect(query.eq).toHaveBeenCalledWith('is_active', true);
  });

  it('findById selects from products and filters by id', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await ProductModel.findById('prod-1');

    expect(client.from).toHaveBeenCalledWith('products');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('id', 'prod-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('create inserts payload and returns single row', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const payload = { name: 'Ube Cake', category: 'Cakes', is_active: true };
    await ProductModel.create(payload);

    expect(query.insert).toHaveBeenCalledWith(payload);
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
  });
});
