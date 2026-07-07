const supabaseModule = require('../../../src/config/supabase');
const getSupabase = vi.fn();
supabaseModule.getSupabase = getSupabase;

const { ProductModel } = require('../../../src/model/product.model');

function buildQueryChain() {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
  };
}

describe('ProductModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply category, search, and active filters when listing products', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await ProductModel.findAll({ category: 'Cake', search: 'vanilla', activeOnly: true });

    expect(getSupabase).toHaveBeenCalledTimes(1);
    expect(client.from).toHaveBeenCalledWith('products');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.order).toHaveBeenCalledWith('name', { ascending: true });
    expect(query.eq).toHaveBeenCalledWith('category', 'Cake');
    expect(query.ilike).toHaveBeenCalledWith('name', '%vanilla%');
    expect(query.eq).toHaveBeenCalledWith('is_active', true);
  });

  it('should fetch a single product by id', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    await ProductModel.findById('prod-1');

    expect(client.from).toHaveBeenCalledWith('products');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('id', 'prod-1');
    expect(query.single).toHaveBeenCalled();
  });

  it('should create a product through the model', async () => {
    const query = buildQueryChain();
    const client = { from: vi.fn().mockReturnValue(query) };
    getSupabase.mockReturnValue(client);

    const payload = { name: 'Cake', price: 200 };
    await ProductModel.create(payload);

    expect(query.insert).toHaveBeenCalledWith(payload);
    expect(query.select).toHaveBeenCalled();
    expect(query.single).toHaveBeenCalled();
  });
});
