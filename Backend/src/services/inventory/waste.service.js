const { WasteModel, IngredientModel, MaterialModel } = require('../../model/inventory.model.js');
const { AppError } = require('../../middleware/errorHandler.js');

// ─── WASTE ───────────────────────────────────────────────────────────────────
const WasteService = {
  getAll: async (limit) => {
    const { data, error } = await WasteModel.findAll(limit);
    if (error) throw error;
    return data;
  },

  log: async (body) => {
    if (body.waste_type === 'ingredient') {
      // Dito ito sumasabog kanina kasi walang IngredientModel sa taas ng file na ito!
      await IngredientModel.deductByName(body.item_name, body.quantity);
    } else if (body.waste_type === 'material') {
      await MaterialModel.deductByName(body.item_name, body.quantity);
    }

    const { data, error } = await WasteModel.create(body);
    if (error) throw error;
    return data;
  },
};

module.exports = { WasteService };