const { MaterialModel } = require('../../../src/model/inventory.model.js');
const { MaterialService } = require('../../../src/services/inventory/material.service.js');

let dbClient = null;
try {
  // dbClient = require('../../../src/config/db.js');
} catch (e) {}

MaterialModel.findAll  = vi.fn();
MaterialModel.findById = vi.fn();
MaterialModel.create   = vi.fn();
MaterialModel.update   = vi.fn();
MaterialModel.setStock = vi.fn();
MaterialModel.delete   = vi.fn();

describe('MaterialService', () => {
  beforeAll(async () => {
    if (dbClient && typeof dbClient.connect === 'function') await dbClient.connect();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    if (dbClient && typeof dbClient.query === 'function') {
      await dbClient.query('DELETE FROM materials;');
    }
  });

  afterEach(async () => {
    // isolation placeholder
  });

  afterAll(async () => {
    if (dbClient && typeof dbClient.disconnect === 'function') await dbClient.disconnect();
  });


  it('it should returns all materials successfully', async () => {
    MaterialModel.findAll.mockResolvedValue({ data: [{ id: 'm-1', name: 'Tarpaulin 2x3ft' }], error: null });
    const res = await MaterialService.getAll();
    expect(res).toEqual([{ id: 'm-1', name: 'Tarpaulin 2x3ft' }]);
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
    const input = { name: 'Tarpaulin 2x3ft', stock_quantity: 5 };
    MaterialModel.create.mockResolvedValue({ data: { id: 'm-1', ...input }, error: null });
    const res = await MaterialService.create(input);
    expect(res.id).toBe('m-1');
    expect(res.name).toBe('Tarpaulin 2x3ft');
  });

  it('it should returns an error when the model fails to create', async () => {
    MaterialModel.create.mockResolvedValue({ data: null, error: new Error('Duplicate entry') });
    await expect(MaterialService.create({ name: 'Balloon set', stock_quantity: 10 })).rejects.toThrow();
  });

  it('it should returns an error when the body is empty', async () => {
    MaterialModel.create.mockResolvedValue({ data: null, error: new Error('null value in column violates not-null constraint') });
    await expect(MaterialService.create({})).rejects.toThrow();
  });

  it('it should returns an error when the body is null', async () => {
    MaterialModel.create.mockResolvedValue({ data: null, error: new Error('Cannot read properties of null') });
    await expect(MaterialService.create(null)).rejects.toThrow();
  });

  it('it should returns the updated material on success', async () => {
    MaterialModel.update.mockResolvedValue({ data: { id: 'm-1', name: 'Balloon set (24pcs)' }, error: null });
    const res = await MaterialService.update('m-1', { name: 'Balloon set (24pcs)' });
    expect(res.name).toBe('Balloon set (24pcs)');
  });

  it('it should returns an error when the material cannot be found during update', async () => {
    MaterialModel.update.mockResolvedValue({ data: null, error: null });
    await expect(MaterialService.update('does-not-exist', { name: 'anything' })).rejects.toThrow();
  });

  it('it should returns an error when the model fails during update', async () => {
    MaterialModel.update.mockResolvedValue({ data: null, error: new Error('DB error') });
    await expect(MaterialService.update('m-1', {})).rejects.toThrow();
  });

  it('it should returns an error when the update body is empty', async () => {
    MaterialModel.update.mockResolvedValue({ data: null, error: new Error('nothing to update') });
    await expect(MaterialService.update('m-1', {})).rejects.toThrow();
  });

  it('it should returns the updated stock after a successful restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: { stock_quantity: 3 }, error: null });
    MaterialModel.setStock.mockResolvedValue({ data: { stock_quantity: 8 }, error: null });
    const res = await MaterialService.restock('m-1', 5);
    expect(res.stock_quantity).toBe(8);
    expect(MaterialModel.setStock).toHaveBeenCalledWith('m-1', 8);
  });

  it('it should returns an error when findById cannot find the material during restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: null, error: null });
    await expect(MaterialService.restock('does-not-exist', 5)).rejects.toThrow();
  });

  it('it should returns an error when findById fails during restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: null, error: new Error('query failed') });
    await expect(MaterialService.restock('m-1', 5)).rejects.toThrow();
  });

  it('it should returns an error when setStock fails during restock', async () => {
    MaterialModel.findById.mockResolvedValue({ data: { stock_quantity: 4 }, error: null });
    MaterialModel.setStock.mockResolvedValue({ data: null, error: new Error('write failed') });
    await expect(MaterialService.restock('m-1', 2)).rejects.toThrow();
  });

  it('it should handles zero restock quantity without returning an error', async () => {
    MaterialModel.findById.mockResolvedValue({ data: { stock_quantity: 6 }, error: null });
    MaterialModel.setStock.mockResolvedValue({ data: { stock_quantity: 6 }, error: null });
    const res = await MaterialService.restock('m-1', 0);
    expect(MaterialModel.setStock).toHaveBeenCalledWith('m-1', 6);
    expect(res.stock_quantity).toBe(6);
  });

  it('it should successfully delete the material', async () => {
    MaterialModel.delete.mockResolvedValue({ error: null });
    await expect(MaterialService.delete('m-1')).resolves.toBeUndefined();
  });

  it('it should returns an error when delete fails', async () => {
    MaterialModel.delete.mockResolvedValue({ error: new Error('foreign key constraint') });
    await expect(MaterialService.delete('m-1')).rejects.toThrow();
  });
});