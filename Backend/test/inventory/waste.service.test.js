const { WasteModel, IngredientModel, MaterialModel } = require('../../src/model/inventory.model.js');
const { WasteService } = require('../../src/services/inventory/waste.service.js');

let dbClient = null;
try {
  // dbClient = require('../../src/config/db.js');
} catch (e) {}

WasteModel.findAll           = vi.fn();
WasteModel.create            = vi.fn();
IngredientModel.deductByName = vi.fn();
MaterialModel.deductByName   = vi.fn();

describe('WasteService', () => {
  beforeAll(async () => {
    if (dbClient && typeof dbClient.connect === 'function') await dbClient.connect();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    if (dbClient && typeof dbClient.query === 'function') {
      await dbClient.query('DELETE FROM waste_logs;');
    }
  });

  afterEach(async () => {
    // isolation check placeholder
  });

  afterAll(async () => {
    if (dbClient && typeof dbClient.disconnect === 'function') await dbClient.disconnect();
  });

  it('it should returns all waste logs successfully', async () => {
    WasteModel.findAll.mockResolvedValue({ data: [{ id: 'w-1', item_name: 'Butter', quantity: 2 }], error: null });
    const res = await WasteService.getAll();
    expect(res).toEqual([{ id: 'w-1', item_name: 'Butter', quantity: 2 }]);
  });

  it('it should returns an empty array when there are no waste logs', async () => {
    WasteModel.findAll.mockResolvedValue({ data: [], error: null });
    const res = await WasteService.getAll();
    expect(res).toEqual([]);
  });

  it('it should returns an error when findAll fails', async () => {
    WasteModel.findAll.mockResolvedValue({ data: null, error: new Error('Connection timeout') });
    await expect(WasteService.getAll()).rejects.toThrow();
  });

  it('it should deducts from ingredients and not materials when waste type is ingredient', async () => {
    const entry = { waste_type: 'ingredient', item_name: 'Butter', quantity: 2 };
    WasteModel.create.mockResolvedValue({ data: entry, error: null });
    IngredientModel.deductByName.mockResolvedValue({ error: null });

    await WasteService.log(entry);

    expect(IngredientModel.deductByName).toHaveBeenCalledWith('Butter', 2);
    expect(MaterialModel.deductByName).not.toHaveBeenCalled();
  });

  it('it should passes the correct name and quantity to ingredient deduction', async () => {
    const entry = { waste_type: 'ingredient', item_name: 'All-purpose flour', quantity: 0.75 };
    WasteModel.create.mockResolvedValue({ data: entry, error: null });
    IngredientModel.deductByName.mockResolvedValue({ error: null });

    await WasteService.log(entry);

    expect(IngredientModel.deductByName).toHaveBeenCalledWith('All-purpose flour', 0.75);
  });

  it('it should deducts from materials and not ingredients when waste type is material', async () => {
    const entry = { waste_type: 'material', item_name: 'Balloon set (12pcs)', quantity: 3 };
    WasteModel.create.mockResolvedValue({ data: entry, error: null });
    MaterialModel.deductByName.mockResolvedValue({ error: null });

    await WasteService.log(entry);

    expect(MaterialModel.deductByName).toHaveBeenCalledWith('Balloon set (12pcs)', 3);
    expect(IngredientModel.deductByName).not.toHaveBeenCalled();
  });

  it('it should passes the correct name and quantity to material deduction', async () => {
    const entry = { waste_type: 'material', item_name: 'Tarpaulin 2x3ft', quantity: 1 };
    WasteModel.create.mockResolvedValue({ data: entry, error: null });
    MaterialModel.deductByName.mockResolvedValue({ error: null });

    await WasteService.log(entry);

    expect(MaterialModel.deductByName).toHaveBeenCalledWith('Tarpaulin 2x3ft', 1);
  });

  it('it should skips all deductions when waste type is not recognized', async () => {
    const entry = { waste_type: 'unknown', item_name: 'Random item', quantity: 1 };
    WasteModel.create.mockResolvedValue({ data: entry, error: null });

    await WasteService.log(entry);

    expect(IngredientModel.deductByName).not.toHaveBeenCalled();
    expect(MaterialModel.deductByName).not.toHaveBeenCalled();
  });

  it('it should skips all deductions when waste type is missing from the body', async () => {
    const entry = { item_name: 'Mystery item', quantity: 5 };
    WasteModel.create.mockResolvedValue({ data: entry, error: null });

    await WasteService.log(entry);

    expect(IngredientModel.deductByName).not.toHaveBeenCalled();
    expect(MaterialModel.deductByName).not.toHaveBeenCalled();
  });

  it('it should returns an error when the body is null', async () => {
    WasteModel.create.mockResolvedValue({ data: {}, error: null });
    await expect(WasteService.log(null)).rejects.toThrow();
  });

  it('it should returns an error when create fails after ingredient deduction', async () => {
    const entry = { waste_type: 'ingredient', item_name: 'Butter', quantity: 2 };
    IngredientModel.deductByName.mockResolvedValue({ error: null });
    WasteModel.create.mockResolvedValue({ data: null, error: new Error('log write failed') });

    await expect(WasteService.log(entry)).rejects.toThrow();
    expect(IngredientModel.deductByName).toHaveBeenCalledWith('Butter', 2);
  });

  it('it should returns an error when create fails after material deduction', async () => {
    const entry = { waste_type: 'material', item_name: 'Balloon set (12pcs)', quantity: 1 };
    MaterialModel.deductByName.mockResolvedValue({ error: null });
    WasteModel.create.mockResolvedValue({ data: null, error: new Error('DB write failed') });

    await expect(WasteService.log(entry)).rejects.toThrow();
    expect(MaterialModel.deductByName).toHaveBeenCalledWith('Balloon set (12pcs)', 1);
  });

  it('it should returns the created waste log on success', async () => {
    const entry = { waste_type: 'ingredient', item_name: 'Cocoa powder', quantity: 0.5 };
    IngredientModel.deductByName.mockResolvedValue({ error: null });
    WasteModel.create.mockResolvedValue({ data: { id: 'w-99', ...entry }, error: null });

    const res = await WasteService.log(entry);
    expect(res.id).toBe('w-99');
    expect(res.item_name).toBe('Cocoa powder');
  });
});