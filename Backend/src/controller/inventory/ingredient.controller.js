const { IngredientService } = require('../../services/inventory/ingredient.service.js');
const { ok, created } = require('../../utils/response.js');
const { StockItemSchema, UpdateStockItemSchema, RestockSchema } = require('../../schemas/index.js');

const IngredientController = {
  getAll: async (_req, res, next) => {
    try { ok(res, await IngredientService.getAll()); }
    catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const body = StockItemSchema.parse(req.body);
      created(res, await IngredientService.create(body), 'Ingredient added');
    } catch (err) { next(err); }
  },
  update: async (req, res, next) => {
    try {
      const body = UpdateStockItemSchema.parse(req.body);
      ok(res, await IngredientService.update(req.params.id, body), 'Ingredient updated');
    } catch (err) { next(err); }
  },
restock: async (req, res, next) => {
    try {
      console.log('--- 1. PUMASOK SA CONTROLLER ---');
      console.log('ID:', req.params.id);
      console.log('BODY GALING FRONTEND:', req.body);
      
      const result = await IngredientService.restock(req.params.id, req.body);
      ok(res, result, 'Restocked');
    } catch (err) { 
      console.error('--- ERROR SA CONTROLLER ---', err.message);
      next(err); 
    }
  },
  delete: async (req, res, next) => {
    try {
      await IngredientService.delete(req.params.id);
      ok(res, null, 'Ingredient deleted');
    } catch (err) { next(err); }
  },
};

module.exports = { IngredientController };