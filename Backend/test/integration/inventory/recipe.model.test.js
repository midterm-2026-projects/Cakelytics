const { createChainableMock } = require('../../../src/helper/supabaseMock.js');

vi.mock('../../../src/config/supabase.js', () => ({
  supabase: { from: vi.fn() },
}));

const { supabase } = require('../../../src/config/supabase.js');
const { RecipeModel } = require('../../../src/model/inventory/recipe.model.js');

describe('RecipeModel', () => {
  let chain;

  beforeEach(() => {
    vi.clearAllMocks();
    chain = createChainableMock();
    vi.spyOn(supabase, 'from').mockReturnValue(chain);
  });

  it('should query the recipes table with joined products and ingredients', async () => {
    chain.__setResult({ data: [{ id: 'r-1' }], error: null });

    const { data, error } = await RecipeModel.findAll();

    expect(supabase.from).toHaveBeenCalledWith('recipes');
    expect(chain.select).toHaveBeenCalledWith('*, products(name, category), recipe_ingredients(*)');
    expect(error).toBeNull();
    expect(data).toEqual([{ id: 'r-1' }]);
  });

  it('should return an error when the recipe is not found by id', async () => {
    chain.__setResult({ data: null, error: new Error('Not found') });

    const { error } = await RecipeModel.findById('00000000-0000-0000-0000-000000000000');
    expect(error).not.toBeNull();
  });

  it('should return an error when the id format is invalid', async () => {
    chain.__setResult({ data: null, error: new Error('invalid input syntax for type uuid') });

    const { error } = await RecipeModel.findById('not-a-valid-uuid');
    expect(error).not.toBeNull();
  });

  it('should only select recipe_ingredients when using findWithIngredients', async () => {
    chain.__setResult({ data: { recipe_ingredients: [] }, error: null });

    await RecipeModel.findWithIngredients('r-1');

    expect(chain.select).toHaveBeenCalledWith('recipe_ingredients(*)');
    expect(chain.eq).toHaveBeenCalledWith('id', 'r-1');
  });

  it('should call insertIngredients with each ingredient mapped to the recipe id', async () => {
    chain.__setResult({ error: null });
    const ingredients = [{ item_name: 'Flour', quantity: 1, unit: 'kg' }];

    await RecipeModel.insertIngredients('r-1', ingredients);

    expect(chain.insert).toHaveBeenCalledWith([{ item_name: 'Flour', quantity: 1, unit: 'kg', recipe_id: 'r-1' }]);
  });

  it('should call deleteIngredients with the correct recipe_id filter', async () => {
    chain.__setResult({ error: null });

    await RecipeModel.deleteIngredients('r-1');

    expect(chain.delete).toHaveBeenCalled();
    expect(chain.eq).toHaveBeenCalledWith('recipe_id', 'r-1');
  });
});