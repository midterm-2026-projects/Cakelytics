const { createChainableMock } = require('../../../src/helper/supabaseMock.js');

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() },
}));

const { supabase } = require('../../../src/config/supabase.js');
const { MaterialModel } = require('../../../src/model/material.model.js');

describe('MaterialModel', () => {
  let chain;

  beforeEach(() => {
    vi.clearAllMocks();
    chain = createChainableMock();
    vi.spyOn(supabase, 'from').mockReturnValue(chain);
  });

  it('should query the celebration_materials table and return all materials on success', async () => {
    chain.__setResult({ data: [{ id: 'm-1', name: 'Tarpaulin' }], error: null });

    const { data, error } = await MaterialModel.findAll();

    expect(supabase.from).toHaveBeenCalledWith('celebration_materials');
    expect(chain.order).toHaveBeenCalledWith('name');
    expect(error).toBeNull();
    expect(data).toEqual([{ id: 'm-1', name: 'Tarpaulin' }]);
  });

  it('should return an error when the material is not found by id', async () => {
    chain.__setResult({ data: null, error: new Error('Not found') });

    const { error } = await MaterialModel.findById('00000000-0000-0000-0000-000000000000');
    expect(chain.eq).toHaveBeenCalledWith('id', '00000000-0000-0000-0000-000000000000');
    expect(error).not.toBeNull();
  });

  it('should return an error when the id format is invalid', async () => {
    chain.__setResult({ data: null, error: new Error('invalid input syntax for type uuid') });

    const { error } = await MaterialModel.findById('not-a-valid-uuid');
    expect(error).not.toBeNull();
  });

  it('should call create with the exact payload and return the created record', async () => {
    const payload = { name: 'TEST_Tarpaulin', unit: 'pc', stock_quantity: 5, minimum_stock: 1, cost_per_unit: 150 };
    chain.__setResult({ data: { id: 'm-1', ...payload }, error: null });

    const { data } = await MaterialModel.create(payload);

    expect(chain.insert).toHaveBeenCalledWith(payload);
    expect(data.id).toBe('m-1');
  });

  it('should call delete with the correct id', async () => {
    chain.__setResult({ error: null });

    const { error } = await MaterialModel.delete('m-1');

    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('id', 'm-1');
    expect(error).toBeNull();
  });
});