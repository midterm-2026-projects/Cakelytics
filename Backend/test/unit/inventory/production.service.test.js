const { ProductionModel, RecipeModel, IngredientModel, MaterialModel } = require('../../../src/model/inventory.model.js');
const { ProductionService } = require('../../../src/services/inventory/production.service.js');

let dbClient = null;
try {
  // dbClient = require('../../../src/config/db.js');
} catch (e) {}

RecipeModel.findWithIngredients  = vi.fn();
ProductionModel.findAll          = vi.fn();
ProductionModel.create           = vi.fn();
ProductionModel.insertDeductions = vi.fn();
IngredientModel.deductByName     = vi.fn();
MaterialModel.deductByName       = vi.fn();

describe('ProductionService', () => {
  beforeAll(async () => {
    if (dbClient && typeof dbClient.connect === 'function') await dbClient.connect();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    if (dbClient && typeof dbClient.query === 'function') {
      await dbClient.query('DELETE FROM production_deductions;');
      await dbClient.query('DELETE FROM productions;');
    }
  });

  afterEach(async () => {
    // dynamic integration boundary placeholder
  });

  afterAll(async () => {
    if (dbClient && typeof dbClient.disconnect === 'function') await dbClient.disconnect();
  });

  it('it should returns all production logs successfully', async () => {
    ProductionModel.findAll.mockResolvedValue({ data: [{ id: 'p-log-1', recipe_id: 'r-1' }], error: null });
    const res = await ProductionService.getAll();
    expect(res).toEqual([{ id: 'p-log-1', recipe_id: 'r-1' }]);
  });

  it('it should returns an empty array when there are no production logs', async () => {
    ProductionModel.findAll.mockResolvedValue({ data: [], error: null });
    const res = await ProductionService.getAll();
    expect(res).toEqual([]);
  });

  it('it should returns an error when findAll fails', async () => {
    ProductionModel.findAll.mockResolvedValue({ data: null, error: new Error('Connection timeout') });
    await expect(ProductionService.getAll()).rejects.toThrow();
  });

  it('it should correctly deducts quantities from both inventory tables based on batch count', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [
        { item_type: 'raw',      item_name: 'White sugar',         quantity: 1.5, unit: 'kg'  },
        { item_type: 'material', item_name: 'Balloon set (12pcs)', quantity: 2,   unit: 'set' },
      ],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-99' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: null });
    IngredientModel.deductByName.mockResolvedValue({ error: null });
    MaterialModel.deductByName.mockResolvedValue({ error: null });

    await ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 2 });

    expect(IngredientModel.deductByName).toHaveBeenCalledWith('White sugar', 3);
    expect(MaterialModel.deductByName).toHaveBeenCalledWith('Balloon set (12pcs)', 4);
  });

  it('it should correctly computes the deduction quantity per batch', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [
        { item_type: 'raw', item_name: 'All-purpose flour', quantity: 1.5, unit: 'kg' },
      ],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-1' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: null });
    IngredientModel.deductByName.mockResolvedValue({ error: null });

    await ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 3 });

    expect(IngredientModel.deductByName).toHaveBeenCalledWith('All-purpose flour', 4.5);
  });

  it('it should only deducts from ingredients when all recipe items are raw', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [
        { item_type: 'raw', item_name: 'Butter', quantity: 0.25, unit: 'kg' },
      ],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-2' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: null });
    IngredientModel.deductByName.mockResolvedValue({ error: null });

    await ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 1 });

    expect(IngredientModel.deductByName).toHaveBeenCalledWith('Butter', 0.25);
    expect(MaterialModel.deductByName).not.toHaveBeenCalled();
  });

  it('it should only deducts from materials when all recipe items are materials', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [
        { item_type: 'material', item_name: 'Tarpaulin 2x3ft', quantity: 1, unit: 'pc' },
      ],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-3' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: null });
    MaterialModel.deductByName.mockResolvedValue({ error: null });

    await ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 2 });

    expect(MaterialModel.deductByName).toHaveBeenCalledWith('Tarpaulin 2x3ft', 2);
    expect(IngredientModel.deductByName).not.toHaveBeenCalled();
  });

  it('it should skips all deductions when the recipe has no ingredients', async () => {
    const mockRecipe = { id: 'r-1', recipe_ingredients: [] };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-4' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: null });

    await ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 5 });

    expect(IngredientModel.deductByName).not.toHaveBeenCalled();
    expect(MaterialModel.deductByName).not.toHaveBeenCalled();
  });

  it('returns an error when findWithIngredients cannot find the recipe', async () => {
    RecipeModel.findWithIngredients.mockResolvedValue({ data: null, error: null });
    await expect(ProductionService.confirmBatch({ recipe_id: 'does-not-exist', batches: 1 })).rejects.toThrow();
  });

  it('returns an error when findWithIngredients fails', async () => {
    RecipeModel.findWithIngredients.mockResolvedValue({ data: null, error: new Error('query failed') });
    await expect(ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 1 })).rejects.toThrow();
  });

  it('it should returns an error when the production log cannot be created', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [{ item_type: 'raw', item_name: 'Sugar', quantity: 1, unit: 'kg' }],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: null, error: new Error('log write failed') });

    await expect(
      ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 1 })
    ).rejects.toThrow();
  });

  it('it should returns an error when insertDeductions fails after log creation', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [{ item_type: 'raw', item_name: 'Sugar', quantity: 1, unit: 'kg' }],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-5' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: new Error('deductions insert failed') });

    await expect(
      ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 1 })
    ).rejects.toThrow();
  });

  it('it should returns the production log on success', async () => {
    const mockRecipe = {
      id: 'r-1',
      recipe_ingredients: [{ item_type: 'raw', item_name: 'Cocoa powder', quantity: 0.5, unit: 'kg' }],
    };
    RecipeModel.findWithIngredients.mockResolvedValue({ data: mockRecipe, error: null });
    ProductionModel.create.mockResolvedValue({ data: { id: 'p-log-99' }, error: null });
    ProductionModel.insertDeductions.mockResolvedValue({ error: null });
    IngredientModel.deductByName.mockResolvedValue({ error: null });

    const res = await ProductionService.confirmBatch({ recipe_id: 'r-1', batches: 2 });
    expect(res.id).toBe('p-log-99');
  });
});