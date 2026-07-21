const { createChainableMock } = require('../../../src/helper/supabaseMock.js');

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() },
}));

const { supabase } = require('../../../src/config/supabase.js');
const { ProductionModel } = require('../../../src/model/production.model.js');

describe('ProductionModel', () => {
  let chain;

  beforeEach(() => {
    vi.clearAllMocks();
    chain = createChainableMock();
    vi.spyOn(supabase, 'from').mockReturnValue(chain);
  });

  it('should query the production_logs table with the default limit', async () => {
    chain.__setResult({ data: [{ id: 'p-1' }], error: null });

    const { data, error } = await ProductionModel.findAll();

    expect(supabase.from).toHaveBeenCalledWith('production_logs');
    expect(chain.limit).toHaveBeenCalledWith(50);
    expect(error).toBeNull();
    expect(data).toEqual([{ id: 'p-1' }]);
  });

  it('should respect a custom limit parameter', async () => {
    chain.__setResult({ data: [{ id: 'p-1' }], error: null });

    await ProductionModel.findAll(1);

    expect(chain.limit).toHaveBeenCalledWith(1);
  });

  it('should call create with the exact payload', async () => {
    const payload = {
      recipe_id: '00000000-0000-0000-0000-000000000000',
      product_id: '11111111-1111-1111-1111-111111111111',
      product_name: 'Test Product',
      batches: 1,
      total_produced: 1,
      yield_unit: 'pcs',
    };
    chain.__setResult({ data: null, error: new Error('foreign key violation') });

    const { error } = await ProductionModel.create(payload);

    expect(chain.insert).toHaveBeenCalledWith(payload);
    expect(error).not.toBeNull();
  });

  it('should call insertDeductions with each deduction mapped to the production_log_id', async () => {
    chain.__setResult({ error: null });
    const deductions = [{ item_type: 'raw', item_name: 'Flour', quantity: 1, unit: 'kg' }];

    await ProductionModel.insertDeductions('p-log-1', deductions);

    expect(chain.insert).toHaveBeenCalledWith([
      { item_type: 'raw', item_name: 'Flour', quantity: 1, unit: 'kg', production_log_id: 'p-log-1' },
    ]);
  });
});