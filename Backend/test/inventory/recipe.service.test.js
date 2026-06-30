const { RecipeModel } = require('../../src/model/inventory.model.js');
const { RecipeService } = require('../../src/services/inventory/recipe.service.js');

let dbClient = null;
try {
  // dbClient = require('../../src/config/db.js');
} catch (e) {}

RecipeModel.findAll           = vi.fn();
RecipeModel.findById          = vi.fn();
RecipeModel.create            = vi.fn();
RecipeModel.insertIngredients = vi.fn();
RecipeModel.update            = vi.fn();
RecipeModel.deleteIngredients = vi.fn();
RecipeModel.delete            = vi.fn();

describe('RecipeService', () => {
  beforeAll(async () => {
    if (dbClient && typeof dbClient.connect === 'function') await dbClient.connect();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    if (dbClient && typeof dbClient.query === 'function') {
      await dbClient.query('DELETE FROM recipe_ingredients;');
      await dbClient.query('DELETE FROM recipes;');
    }
  });

  afterEach(async () => {
    // isolation placeholder
  });

  afterAll(async () => {
    if (dbClient && typeof dbClient.disconnect === 'function') await dbClient.disconnect();
  });

  it('it should returns all recipes successfully', async () => {
    RecipeModel.findAll.mockResolvedValue({ data: [{ id: 'r-1', product_id: 'p-1' }], error: null });
    const res = await RecipeService.getAll();
    expect(res).toEqual([{ id: 'r-1', product_id: 'p-1' }]);
  });

  it('it should returns an empty array when there are no recipes', async () => {
    RecipeModel.findAll.mockResolvedValue({ data: [], error: null });
    const res = await RecipeService.getAll();
    expect(res).toEqual([]);
  });

  it('it should returns an error when findAll fails', async () => {
    RecipeModel.findAll.mockResolvedValue({ data: null, error: new Error('Connection timeout') });
    await expect(RecipeService.getAll()).rejects.toThrow();
  });


  it('it should returns the recipe when found by id', async () => {
    RecipeModel.findById.mockResolvedValue({ data: { id: 'r-1', product_id: 'p-1' }, error: null });
    const res = await RecipeService.getById('r-1');
    expect(res.id).toBe('r-1');
  });

  it('it should returns an error when getById cannot find the recipe', async () => {
    RecipeModel.findById.mockResolvedValue({ data: null, error: null });
    await expect(RecipeService.getById('does-not-exist')).rejects.toThrow();
  });

  it('it should returns an error when findById fails during getById', async () => {
    RecipeModel.findById.mockResolvedValue({ data: null, error: new Error('query failed') });
    await expect(RecipeService.getById('r-1')).rejects.toThrow();
  });

  it('it should returns the created recipe with its ingredients on success', async () => {
    const payload = {
      product_id: 'p-1',
      yield_quantity: 1,
      ingredients: [{ item_name: 'White sugar', quantity: 2, unit: 'kg' }],
    };
    RecipeModel.create.mockResolvedValue({ data: { id: 'r-123' }, error: null });
    RecipeModel.insertIngredients.mockResolvedValue({ error: null });

    const res = await RecipeService.create(payload);
    expect(res.id).toBe('r-123');
    expect(RecipeModel.insertIngredients).toHaveBeenCalledWith('r-123', payload.ingredients);
  });

  it('it should handles an empty ingredients array without returning an error', async () => {
    const payload = { product_id: 'p-1', yield_quantity: 1, ingredients: [] };
    RecipeModel.create.mockResolvedValue({ data: { id: 'r-124' }, error: null });
    RecipeModel.insertIngredients.mockResolvedValue({ error: null });

    const res = await RecipeService.create(payload);
    expect(res.id).toBe('r-124');
    expect(RecipeModel.insertIngredients).toHaveBeenCalledWith('r-124', []);
  });

  it('it should returns an error when the recipe row cannot be created', async () => {
    RecipeModel.create.mockResolvedValue({ data: null, error: new Error('DB write failed') });
    await expect(
      RecipeService.create({ product_id: 'p-1', yield_quantity: 1, ingredients: [] })
    ).rejects.toThrow();
  });

  it('it should returns an error when insertIngredients fails after recipe creation', async () => {
    RecipeModel.create.mockResolvedValue({ data: { id: 'r-125' }, error: null });
    RecipeModel.insertIngredients.mockResolvedValue({ error: new Error('ingredient insert failed') });

    await expect(
      RecipeService.create({ product_id: 'p-1', yield_quantity: 1, ingredients: [{ item_name: 'Butter', quantity: 1 }] })
    ).rejects.toThrow();
  });

  it('it should returns an error when the body is empty', async () => {
    RecipeModel.create.mockResolvedValue({ data: null, error: new Error('null value violation') });
    await expect(RecipeService.create({})).rejects.toThrow();
  });

  it('it should returns the updated recipe on success', async () => {
    RecipeModel.update.mockResolvedValue({ data: { id: 'r-1', yield_quantity: 2 }, error: null });
    const res = await RecipeService.update('r-1', { yield_quantity: 2 });
    expect(res.yield_quantity).toBe(2);
  });

  it('it should returns an error when the recipe cannot be found during update', async () => {
    RecipeModel.update.mockResolvedValue({ data: null, error: null });
    await expect(RecipeService.update('does-not-exist', { yield_quantity: 1 })).rejects.toThrow();
  });

  it('it should returns an error when the model fails during update', async () => {
    RecipeModel.update.mockResolvedValue({ data: null, error: new Error('DB error') });
    await expect(RecipeService.update('r-1', {})).rejects.toThrow();
  });

  it('it should replaces all ingredients when a new ingredients array is passed on update', async () => {
    RecipeModel.update.mockResolvedValue({ data: { id: 'r-1' }, error: null });
    RecipeModel.deleteIngredients.mockResolvedValue({ error: null });
    RecipeModel.insertIngredients.mockResolvedValue({ error: null });

    const newIngredients = [{ item_name: 'Cake flour', quantity: 1.5, unit: 'kg' }];
    await RecipeService.update('r-1', { yield_quantity: 1, ingredients: newIngredients });

    expect(RecipeModel.deleteIngredients).toHaveBeenCalledWith('r-1');
    expect(RecipeModel.insertIngredients).toHaveBeenCalledWith('r-1', newIngredients);
  });

  it('it should not touch ingredients when the field is absent from the update body', async () => {
    RecipeModel.update.mockResolvedValue({ data: { id: 'r-1' }, error: null });

    await RecipeService.update('r-1', { yield_quantity: 3 });

    expect(RecipeModel.deleteIngredients).not.toHaveBeenCalled();
    expect(RecipeModel.insertIngredients).not.toHaveBeenCalled();
  });

  it('it should clears all ingredients when an empty array is passed on update', async () => {
    RecipeModel.update.mockResolvedValue({ data: { id: 'r-1' }, error: null });
    RecipeModel.deleteIngredients.mockResolvedValue({ error: null });

    await RecipeService.update('r-1', { ingredients: [] });

    expect(RecipeModel.deleteIngredients).toHaveBeenCalledWith('r-1');
    expect(RecipeModel.insertIngredients).not.toHaveBeenCalled();
  });

  it('it should returns an error when insertIngredients fails during update', async () => {
    RecipeModel.update.mockResolvedValue({ data: { id: 'r-1' }, error: null });
    RecipeModel.deleteIngredients.mockResolvedValue({ error: null });
    RecipeModel.insertIngredients.mockResolvedValue({ error: new Error('insert failed on update') });

    await expect(
      RecipeService.update('r-1', { ingredients: [{ item_name: 'Butter', quantity: 1 }] })
    ).rejects.toThrow();
  });

  it('it should successfully delete the recipe', async () => {
    RecipeModel.delete.mockResolvedValue({ error: null });
    await expect(RecipeService.delete('r-1')).resolves.toBeUndefined();
  });

  it('it should returns an error when delete fails', async () => {
    RecipeModel.delete.mockResolvedValue({ error: new Error('foreign key constraint') });
    await expect(RecipeService.delete('r-1')).rejects.toThrow();
  });
});