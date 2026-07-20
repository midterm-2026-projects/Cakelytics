const { createChainableMock } = require('../../../src/helper/supabaseMock.js');

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() },
}));

const { supabase } = require('../../../src/config/supabase.js');
const { IngredientModel } = require('../../../src/model/ingredient.model.js');

describe('IngredientModel', () => {
  let chain;

  beforeEach(() => {
    vi.clearAllMocks();
    chain = createChainableMock();
    vi.spyOn(supabase, 'from').mockReturnValue(chain);
  });

  it('should query the raw_ingredients table and return all ingredients on success', async () => {
    chain.__setResult({ data: [{ id: '1', name: 'Flour' }], error: null });

    const { data, error } = await IngredientModel.findAll();

    expect(supabase.from).toHaveBeenCalledWith('raw_ingredients');
    expect(chain.select).toHaveBeenCalledWith('*');
    expect(chain.order).toHaveBeenCalledWith('name');
    expect(error).toBeNull();
    expect(data).toEqual([{ id: '1', name: 'Flour' }]);
  });

  it('should query by id and return an error when the ingredient is not found', async () => {
    chain.__setResult({ data: null, error: new Error('Not found') });

    const { error } = await IngredientModel.findById('00000000-0000-0000-0000-000000000000');

    expect(chain.eq).toHaveBeenCalledWith('id', '00000000-0000-0000-0000-000000000000');
    expect(chain.single).toHaveBeenCalled();
    expect(error).not.toBeNull();
  });

  it('should return an error when the id format is invalid', async () => {
    chain.__setResult({ data: null, error: new Error('invalid input syntax for type uuid') });

    const { error } = await IngredientModel.findById('not-a-valid-uuid');
    expect(error).not.toBeNull();
  });

  it('should call create with the exact payload and return the created record', async () => {
    const payload = { name: 'TEST_Flour', unit: 'kg', stock_quantity: 10, minimum_stock: 2, cost_per_unit: 50 };
    chain.__setResult({ data: { id: 'i-1', ...payload }, error: null });

    const { data, error } = await IngredientModel.create(payload);

    expect(chain.insert).toHaveBeenCalledWith(payload);
    expect(error).toBeNull();
    expect(data.id).toBe('i-1');
  });

  it('should call update with the correct id and payload', async () => {
    chain.__setResult({ data: { id: 'i-1', name: 'Bread flour' }, error: null });

    const { data } = await IngredientModel.update('i-1', { name: 'Bread flour' });

    expect(chain.update).toHaveBeenCalledWith({ name: 'Bread flour' });
    expect(chain.eq).toHaveBeenCalledWith('id', 'i-1');
    expect(data.name).toBe('Bread flour');
  });

  it('should call setStock with the correct stock_quantity value', async () => {
    chain.__setResult({ data: { id: 'i-1', stock_quantity: 15 }, error: null });

    await IngredientModel.setStock('i-1', 15);

    expect(chain.update).toHaveBeenCalledWith({ stock_quantity: 15 });
    expect(chain.eq).toHaveBeenCalledWith('id', 'i-1');
  });

  it('should call delete with the correct id', async () => {
    chain.__setResult({ error: null });

    const { error } = await IngredientModel.delete('i-1');

    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'i-1');
    expect(error).toBeNull();
  });
});