const { IngredientModel } = require('../../model/inventory.model.js');
const { AppError } = require('../../middleware/errorHandler.js');

// RAW INGREDIENTS
const IngredientService = {
  getAll: async () => {
    const { data, error } = await IngredientModel.findAll();
    if (error) throw error;
    return data;
  },

  create: async (body) => {
    const { data, error } = await IngredientModel.create(body);
    if (error) throw error;
    return data;
  },

  update: async (id, body) => {
    const { data, error } = await IngredientModel.update(id, body);
    if (error || !data) throw new AppError('Ingredient not found', 404);
    return data;
  },

  restock: async (id, qty) => {
    const { data: current, error: findErr } = await IngredientModel.findById(id);
    if (findErr || !current) throw new AppError('Ingredient not found', 404);

    const { data, error } = await IngredientModel.setStock(id, current.stock_quantity + qty);
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await IngredientModel.delete(id);
    if (error) throw error;
  },
};

module.exports = { IngredientService };