const { RecipeService } = require('../../services/inventory/recipe.service.js');
const { ok, created } = require('../../utils/response.js');
const { CreateRecipeSchema, UpdateRecipeSchema } = require('../../schemas/index.js');

const RecipeController = {
  getAll: async (_req, res, next) => {
    try { ok(res, await RecipeService.getAll()); }
    catch (err) { next(err); }
  },
  getById: async (req, res, next) => {
    try { ok(res, await RecipeService.getById(req.params.id)); }
    catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const body = CreateRecipeSchema.parse(req.body);
      created(res, await RecipeService.create(body), 'Recipe created');
    } catch (err) { next(err); }
  },
  update: async (req, res, next) => {
    try {
      const body = UpdateRecipeSchema.parse(req.body);
      ok(res, await RecipeService.update(req.params.id, body), 'Recipe updated');
    } catch (err) { next(err); }
  },
  delete: async (req, res, next) => {
    try {
      await RecipeService.delete(req.params.id);
      ok(res, null, 'Recipe deleted');
    } catch (err) { next(err); }
  },
};

module.exports = { RecipeController };