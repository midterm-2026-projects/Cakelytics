const { IngredientModel } = require('../../model/inventory/ingredient.model.js');
const { InventoryLogModel } = require('../../model/inventory/inventoryLog.model.js'); // Idinagdag natin ito
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

restock: async (id, body) => {
    console.log('--- 2. PUMASOK SA SERVICE ---');
    
    const { data: current, error: findErr } = await IngredientModel.findById(id);
    if (findErr || !current) throw new AppError('Ingredient not found', 404);

    const newTotalStock = current.stock_quantity + Number(body.added_qty);
    console.log('BAGONG TOTAL STOCK:', newTotalStock);

    const { data, error } = await IngredientModel.update(id, {
      stock_quantity: newTotalStock,
      minimum_stock: Number(body.minimum_stock)
    });
    if (error || !data) throw new AppError('Failed to update ingredient', 500);

    console.log('--- 3. MAGSE-SAVE NA SA LOGS TABLE ---');
    const logPayload = {
      item_type: 'raw',
      item_name: current.name,
      transaction_type: 'IN',
      quantity: Number(body.added_qty),
      cost: Number(body.total_cost || 0),
      action: 'Restock'
    };
    console.log('DATA NA IPAPASA SA SUPABASE:', logPayload);

    await InventoryLogModel.logHistory(logPayload);

    return data;
  },

  delete: async (id) => {
    const { error } = await IngredientModel.delete(id);
    if (error) throw error;
  },
};

module.exports = { IngredientService };