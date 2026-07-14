const { MaterialModel } = require('../../model/inventory/material.model.js');
const { InventoryLogModel } = require('../../model/inventory/inventoryLog.model.js');
const { AppError } = require('../../middleware/errorHandler.js');

const MaterialService = {
  getAll: async () => {
    const { data, error } = await MaterialModel.findAll();
    if (error) throw error;
    return data;
  },

  create: async (body) => {
    const { data, error } = await MaterialModel.create(body);
    if (error) throw error;
    return data;
  },

  update: async (id, body) => {
    const { data, error } = await MaterialModel.update(id, body);
    if (error) throw new AppError(`Failed to update material: ${error.message}`, 500);
    return data;
  },

  restock: async (id, body) => {
    // 1. Harangin kapag sobrang laki ng numbers (Overflow Guard)
    const addedQty = Number(body.added_qty);
    const totalCost = Number(body.total_cost || 0);

    if (addedQty > 1000000 || totalCost > 1000000) {
      throw new AppError('Masyadong malaki ang numero na inilagay. Pakibabaan ang quantity o cost.', 400);
    }

    // 2. Hanapin ang current material
    const { data: current, error: findErr } = await MaterialModel.findById(id);
    if (findErr || !current) throw new AppError('Material not found', 404);

    // 3. Compute ang bagong stock
    const newTotalStock = Number(current.stock_quantity || 0) + addedQty;

    // 4. I-update sa database
    const { data, error } = await MaterialModel.update(id, {
      stock_quantity: newTotalStock,
      minimum_stock: Number(body.minimum_stock)
    });

    if (error) {
      console.error("SUPABASE UPDATE ERROR:", error);
      throw new AppError(`Failed to update material: ${error.message}`, 500);
    }

    // 5. I-save sa logs nang LIGTAS (Hindi magka-crash kahit undefined ang return)
    try {
      const logPayload = {
        item_type: 'material',
        item_name: current.name,
        transaction_type: 'IN',
        quantity: addedQty,
        cost: totalCost,
        action: 'Restock'
      };

      const logResult = await InventoryLogModel.logHistory(logPayload);
      
      // Fallback check kung sakaling object nga ang ibinato at may error
      if (logResult && logResult.error) {
        console.error("SUPABASE LOG ERROR:", logResult.error);
        throw new AppError(`Failed to save log: ${logResult.error.message}`, 500);
      }
    } catch (logErr) {
      // Kung mag-throw man ang logHistory function mo internally, hindi mada-damage ang restock natin
      console.error("LIGTAS NA NASALO ANG LOGGING ERROR:", logErr);
    }

    return data;
  },

  delete: async (id) => {
    const { error } = await MaterialModel.delete(id);
    if (error) throw error;
  },
};

module.exports = { MaterialService };