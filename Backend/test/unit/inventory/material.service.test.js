const { MaterialModel } = require('../../../src/model/inventory/material.model.js');
const { MaterialService } = require('../../../src/services/inventory/material.service.js');

vi.mock('../../../src/model/inventory/inventoryLog.model.js', () => ({
  InventoryLogModel: { logHistory: vi.fn().mockResolvedValue({ error: null }) }
}));

const VALID_UUID = '00000000-0000-0000-0000-000000000000';

MaterialModel.findAll  = vi.fn();
MaterialModel.findById = vi.fn();
MaterialModel.create   = vi.fn();
MaterialModel.update   = vi.fn();
MaterialModel.delete   = vi.fn();

describe('MaterialService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('it should returns all materials successfully', async () => {
    MaterialModel.findAll.mockResolvedValue({ data: [{ id: VALID_UUID, name: 'Tarpaulin 2x3ft' }], error: null });
    const res = await MaterialService.getAll();
    expect(res).toEqual([{ id: VALID_UUID, name: 'Tarpaulin 2x3ft' }]);
  });

  it('it should returns an empty array when there are no materials', async () => {
    MaterialModel.findAll.mockResolvedValue({ data: [], error: null });
    const res = await MaterialService.getAll();
    expect(res).toEqual([]);
  });

  it('it should returns an error when findAll fails', async () => {
    MaterialModel.findAll.mockResolvedValue({ data: null, error: new Error('Connection timeout') });
    await expect(MaterialService.getAll()).rejects.toThrow();
  });
  
  it('it should returns the created material on success', async () => {
    const input = { name: 'Tarpaulin 2x3ft', stock_quantity: 5, unit: 'pc' };
    MaterialModel.create.mockResolvedValue({ data: { id: VALID_UUID, ...input }, error: null });
    const res = await MaterialService.create(input);
    expect(res.id).toBe(VALID_UUID);
  });

  it('it should returns an error when the model fails to create', async () => {
    MaterialModel.create.mockResolvedValue({ data: null, error: new Error('Duplicate entry') });
    await expect(MaterialService.create({ name: 'Balloon set', stock_quantity: 10 })).rejects.toThrow();
  });

  it('it should returns an error when the body is empty', async () => {
    MaterialModel.create.mockResolvedValue({ data: null, error: new Error('null') });
    await expect(MaterialService.create({})).rejects.toThrow();
  });

  it('it should returns an error when the body is null', async () => {
    MaterialModel.create.mockResolvedValue({ data: null, error: new Error('null') });
    await expect(MaterialService.create(null)).rejects.toThrow();
  });

  it('it should returns the updated material on success', async () => {
    MaterialModel.update.mockResolvedValue({ data: { id: VALID_UUID, name: 'Balloon set (24pcs)' }, error: null });
    const res = await MaterialService.update(VALID_UUID, { name: 'Balloon set (24pcs)' });
    expect(res.name).toBe('Balloon set (24pcs)');
  });

  it('it should returns an error when the material cannot be found during update', async () => {
    MaterialModel.update.mockResolvedValue({ data: null, error: new Error('Not found') });
    await expect(MaterialService.update(VALID_UUID, { name: 'anything' })).rejects.toThrow();
  });

  it('it should returns an error when the model fails during update', async () => {
    MaterialModel.update.mockResolvedValue({ data: null, error: new Error('DB error') });
    await expect(MaterialService.update(VALID_UUID, {})).rejects.toThrow();
  });

  it('it should returns an error when the update body is empty', async () => {
    MaterialModel.update.mockResolvedValue({ data: null, error: new Error('nothing') });
    await expect(MaterialService.update(VALID_UUID, {})).rejects.toThrow();
  });

  it('it should returns the updated stock after a successful restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: { id: VALID_UUID, name: 'Test', stock_quantity: 3 }, error: null });
    MaterialModel.update.mockResolvedValue({ data: { stock_quantity: 8 }, error: null });
    const res = await MaterialService.restock(VALID_UUID, { added_qty: 5, minimum_stock: 0 });
    expect(res.stock_quantity).toBe(8);
  });

  it('it should returns an error when findById cannot find the material during restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: null, error: null });
    await expect(MaterialService.restock(VALID_UUID, { added_qty: 5 })).rejects.toThrow();
  });

  it('it should returns an error when findById fails during restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: null, error: new Error('query failed') });
    await expect(MaterialService.restock(VALID_UUID, { added_qty: 5 })).rejects.toThrow();
  });

  it('it should returns an error when setStock fails during restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: { name: 'Test', stock_quantity: 4 }, error: null });
    MaterialModel.update.mockResolvedValue({ data: null, error: new Error('write failed') });
    await expect(MaterialService.restock(VALID_UUID, { added_qty: 2 })).rejects.toThrow();
  });

  it('it should handles zero restock quantity without returning an error', async () => {
    MaterialModel.findById.mockResolvedValue({ data: { name: 'Test', stock_quantity: 6 }, error: null });
    MaterialModel.update.mockResolvedValue({ data: { stock_quantity: 6 }, error: null });
    const res = await MaterialService.restock(VALID_UUID, { added_qty: 0, minimum_stock: 0 });
    expect(res.stock_quantity).toBe(6);
  });

  it('it should successfully delete the material', async () => {
    MaterialModel.delete.mockResolvedValue({ error: null });
    await expect(MaterialService.delete(VALID_UUID)).resolves.toBeUndefined();
  });

  it('it should returns an error when delete fails', async () => {
    MaterialModel.delete.mockResolvedValue({ error: new Error('fail') });
    await expect(MaterialService.delete(VALID_UUID)).rejects.toThrow();
  });
});