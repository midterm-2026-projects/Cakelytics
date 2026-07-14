// 👉 FIX: Itinama ang import path para mag-match sa ginagamit ng service
const { IngredientModel } = require('../../../src/model/inventory/ingredient.model.js');
const { IngredientService } = require('../../../src/services/inventory/ingredient.service.js');

const { InventoryLogModel } = require('../../../src/model/inventory/inventoryLog.model.js');

let dbClient = null;
try {
  // dbClient = require('../../../src/config/db.js');
} catch (e) {}

InventoryLogModel.logHistory = vi.fn().mockResolvedValue({ error: null });

// Ngayon, gagana na ang mocks dahil iisang object na ang tinutukoy nila
IngredientModel.findAll   = vi.fn();
IngredientModel.findById  = vi.fn();
IngredientModel.create    = vi.fn();
IngredientModel.update    = vi.fn();
IngredientModel.delete    = vi.fn();

describe('IngredientService', () => {
  beforeAll(async () => {
    if (dbClient && typeof dbClient.connect === 'function') await dbClient.connect();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    if (dbClient && typeof dbClient.query === 'function') {
      await dbClient.query('DELETE FROM ingredients;');
    }
  });

  afterEach(async () => {});

  afterAll(async () => {
    if (dbClient && typeof dbClient.disconnect === 'function') await dbClient.disconnect();
  });

  it('it should returns all ingredients successfully', async () => {
    IngredientModel.findAll.mockResolvedValue({ data: [{ id: '1', name: 'All-purpose flour' }], error: null });
    const res = await IngredientService.getAll();
    expect(res).toEqual([{ id: '1', name: 'All-purpose flour' }]);
  });

  it('it should returns an empty array when there are no ingredients', async () => {
    IngredientModel.findAll.mockResolvedValue({ data: [], error: null });
    const res = await IngredientService.getAll();
    expect(res).toEqual([]);
  });

  it('it should returns an error when findAll fails', async () => {
    IngredientModel.findAll.mockResolvedValue({ data: null, error: new Error('Connection timeout') });
    await expect(IngredientService.getAll()).rejects.toThrow();
  });

  it('it should returns the created ingredient on success', async () => {
    const input = { name: 'Cocoa powder', stock_quantity: 10, unit: 'kg' };
    IngredientModel.create.mockResolvedValue({ data: { id: 'i-1', ...input }, error: null });
    const res = await IngredientService.create(input);
    expect(res.id).toBe('i-1');
    expect(res.name).toBe('Cocoa powder');
  });

  it('it should returns an error when the model fails to create', async () => {
    IngredientModel.create.mockResolvedValue({ data: null, error: new Error('Duplicate entry') });
    await expect(IngredientService.create({ name: 'Butter', stock_quantity: 5 })).rejects.toThrow();
  });

  it('it should returns an error when the body is empty', async () => {
    IngredientModel.create.mockResolvedValue({ data: null, error: new Error('null value in column violates not-null constraint') });
    await expect(IngredientService.create({})).rejects.toThrow();
  });

  it('it should returns an error when the body is null', async () => {
    IngredientModel.create.mockResolvedValue({ data: null, error: new Error('Cannot read properties of null') });
    await expect(IngredientService.create(null)).rejects.toThrow();
  });

  it('it should returns the updated ingredient on success', async () => {
    IngredientModel.update.mockResolvedValue({ data: { id: 'i-1', name: 'Bread flour' }, error: null });
    const res = await IngredientService.update('i-1', { name: 'Bread flour' });
    expect(res.name).toBe('Bread flour');
  });

  it('it should returns an error when the ingredient cannot be found during update', async () => {
    IngredientModel.update.mockResolvedValue({ data: null, error: null });
    await expect(IngredientService.update('does-not-exist', { name: 'anything' })).rejects.toThrow();
  });

  it('it should returns an error when the model fails during update', async () => {
    IngredientModel.update.mockResolvedValue({ data: null, error: new Error('DB error') });
    await expect(IngredientService.update('i-1', {})).rejects.toThrow();
  });

  it('it should returns an error when the update body is empty', async () => {
    IngredientModel.update.mockResolvedValue({ data: null, error: new Error('nothing to update') });
    await expect(IngredientService.update('i-1', {})).rejects.toThrow();
  });

  it('it should returns the updated stock after a successful restock', async () => {
    IngredientModel.findById.mockResolvedValue({ data: { name: 'Test', stock_quantity: 10 }, error: null });
    IngredientModel.update.mockResolvedValue({ data: { stock_quantity: 15 }, error: null });
    const res = await IngredientService.restock('i-1', { added_qty: 5, minimum_stock: 0 });
    expect(res.stock_quantity).toBe(15);
    expect(IngredientModel.update).toHaveBeenCalledWith('i-1', { stock_quantity: 15, minimum_stock: 0 });
  });

  it('it should returns an error when findById cannot find the ingredient during restock', async () => {
    IngredientModel.findById.mockResolvedValue({ data: null, error: null });
    await expect(IngredientService.restock('does-not-exist', { added_qty: 5 })).rejects.toThrow();
  });

  it('it should returns an error when findById fails during restock', async () => {
    IngredientModel.findById.mockResolvedValue({ data: null, error: new Error('query failed') });
    await expect(IngredientService.restock('i-1', { added_qty: 5 })).rejects.toThrow();
  });

  it('it should returns an error when setStock fails during restock', async () => {
    IngredientModel.findById.mockResolvedValue({ data: { name: 'Test', stock_quantity: 8 }, error: null });
    IngredientModel.update.mockResolvedValue({ data: null, error: new Error('write failed') });
    await expect(IngredientService.restock('i-1', { added_qty: 2 })).rejects.toThrow();
  });

  it('it should handles zero restock quantity without returning an error', async () => {
    IngredientModel.findById.mockResolvedValue({ data: { name: 'Test', stock_quantity: 10 }, error: null });
    IngredientModel.update.mockResolvedValue({ data: { stock_quantity: 10 }, error: null });
    const res = await IngredientService.restock('i-1', { added_qty: 0, minimum_stock: 0 });
    expect(IngredientModel.update).toHaveBeenCalledWith('i-1', { stock_quantity: 10, minimum_stock: 0 });
    expect(res.stock_quantity).toBe(10);
  });

  it('it should successfully delete the ingredient', async () => {
    IngredientModel.delete.mockResolvedValue({ error: null });
    await expect(IngredientService.delete('i-1')).resolves.toBeUndefined();
  });

  it('it should returns an error when delete fails', async () => {
    IngredientModel.delete.mockResolvedValue({ error: new Error('foreign key constraint') });
    await expect(IngredientService.delete('i-1')).rejects.toThrow();
  });
});