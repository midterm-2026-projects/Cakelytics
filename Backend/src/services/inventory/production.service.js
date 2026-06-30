const { ProductionModel, RecipeModel, IngredientModel, MaterialModel } = require('../../model/inventory.model.js');
const { AppError } = require('../../middleware/errorHandler.js');

// PRODUCTION
const ProductionService = {
  getAll: async (limit) => {
    const { data, error } = await ProductionModel.findAll(limit);
    if (error) throw error;
    return data;
  },

  confirmBatch: async (body) => {
    const { data: recipe, error: recipeErr } = await RecipeModel.findWithIngredients(body.recipe_id);
    if (recipeErr || !recipe) throw new AppError('Recipe not found', 404);

    const deductions = recipe.recipe_ingredients.map(ri => ({
      item_type: ri.item_type,
      item_name: ri.item_name,
      quantity:  +(ri.quantity * body.batches).toFixed(4),
      unit:      ri.unit,
    }));

    const { data: log, error: logErr } = await ProductionModel.create(body);
    if (logErr) throw logErr;

    const { error: deductErr } = await ProductionModel.insertDeductions(log.id, deductions);
    if (deductErr) throw deductErr;

    for (const d of deductions) {
      if (d.item_type === 'raw') {
        await IngredientModel.deductByName(d.item_name, d.quantity);
      } else {
        await MaterialModel.deductByName(d.item_name, d.quantity);
      }
    }

    return log;
  },
};

module.exports = { ProductionService };