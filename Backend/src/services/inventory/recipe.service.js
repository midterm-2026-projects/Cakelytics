const { RecipeModel } = require('../../model/inventory/recipe.model.js');
const { AppError } = require('../../middleware/errorHandler.js');

// RECIPES
const RecipeService = {
  getAll: async () => {
    const { data, error } = await RecipeModel.findAll();
    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await RecipeModel.findById(id);
    if (error || !data) throw new AppError('Recipe not found', 404);
    return data;
  },

  create: async (body) => {
    const { ingredients, ...recipeData } = body;
    const { data: recipe, error } = await RecipeModel.create(recipeData);
    if (error) throw error;

    const { error: ingErr } = await RecipeModel.insertIngredients(recipe.id, ingredients);
    if (ingErr) throw ingErr;

    return recipe;
  },

  update: async (id, body) => {
    const { ingredients, ...recipeData } = body;
    const { data, error } = await RecipeModel.update(id, recipeData);
    if (error || !data) throw new AppError('Recipe not found', 404);

    if (ingredients !== undefined) {
      await RecipeModel.deleteIngredients(id);
      if (ingredients.length) {
        const { error: ingErr } = await RecipeModel.insertIngredients(id, ingredients);
        if (ingErr) throw ingErr;
      }
    }
    return data;
  },

  delete: async (id) => {
    const { error } = await RecipeModel.delete(id);
    if (error) throw error;
  },
};

module.exports = { RecipeService };