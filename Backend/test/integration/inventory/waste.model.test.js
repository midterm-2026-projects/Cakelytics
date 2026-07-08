const { createChainableMock } = require('../../../src/helper/supabaseMock.js');

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() },
}));

const { supabase } = require('../../../src/config/supabase.js');
const { WasteModel } = require('../../../src/model/inventory/waste.model.js');

describe('WasteModel', () => {
  let chain;

  beforeEach(() => {
    vi.clearAllMocks();
    chain = createChainableMock();
    vi.spyOn(supabase, 'from').mockReturnValue(chain);
  });

  it('should query the waste_logs table with the default limit', async () => {
    chain.__setResult({ data: [{ id: 'w-1' }], error: null });

    const { data, error } = await WasteModel.findAll();

    expect(supabase.from).toHaveBeenCalledWith('waste_logs');
    expect(chain.limit).toHaveBeenCalledWith(50);
    expect(error).toBeNull();
    expect(data).toEqual([{ id: 'w-1' }]);
  });

  it('should respect a custom limit parameter', async () => {
    chain.__setResult({ data: [{ id: 'w-1' }], error: null });

    await WasteModel.findAll(1);

    expect(chain.limit).toHaveBeenCalledWith(1);
  });

  it('should call create with the exact payload and return the created record', async () => {
    const payload = {
      waste_type: 'ingredient',
      item_name: 'TEST_WasteItem',
      quantity: 1,
      unit: 'kg',
      reason: 'Integration test',
      cost: 10,
    };
    chain.__setResult({ data: { id: 'w-99', ...payload }, error: null });

    const { data } = await WasteModel.create(payload);

    expect(chain.insert).toHaveBeenCalledWith(payload);
    expect(data.id).toBe('w-99');
  });
});