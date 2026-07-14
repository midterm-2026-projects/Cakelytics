const { WasteModel } = require('../../model/inventory/waste.model.js');
const { IngredientModel } = require('../../model/inventory/ingredient.model.js');
const { MaterialModel } = require('../../model/inventory/material.model.js');
const { InventoryLogModel } = require('../../model/inventory/inventoryLog.model.js'); // Idinagdag natin ito
const { AppError } = require('../../middleware/errorHandler.js');

// ─── WASTE ───────────────────────────────────────────────────────────────────
const WasteService = {
  getAll: async (limit) => {
    const { data, error } = await WasteModel.findAll(limit);
    if (error) throw error;
    return data;
  },

  log: async (body) => {
    // 1. Logic for deducting stocks
    if (body.waste_type === 'ingredient') {
      await IngredientModel.deductByName(body.item_name, body.quantity);
    } else if (body.waste_type === 'material') {
      await MaterialModel.deductByName(body.item_name, body.quantity);
    }

    // 2. Correct way to call Supabase via WasteModel
    const response = await WasteModel.create(body);
    if (response.error) throw response.error;

    // 3. I-SAVE SA INVENTORY LOGS (Para sa 'OUT' analytics)
    if (body.waste_type === 'ingredient' || body.waste_type === 'material') {
      await InventoryLogModel.logHistory({
        item_type: body.waste_type === 'ingredient' ? 'raw' : 'material',
        item_name: body.item_name,
        transaction_type: 'OUT',
        quantity: Number(body.quantity),
        cost: Number(body.cost || 0),
        action: 'Waste'
      });
    }

    return response.data;
  },
};

module.exports = { WasteService };