const { supabase } = require('../../config/supabase.js'); // 👉 Idinagdag para makapag-update diretso sa products
const { ProductionModel } = require('../../model/inventory/production.model.js');
const { RecipeModel } = require('../../model/inventory/recipe.model.js');
const { IngredientModel } = require('../../model/inventory/ingredient.model.js');
const { MaterialModel } = require('../../model/inventory/material.model.js');
const { InventoryLogModel } = require('../../model/inventory/inventoryLog.model.js'); 
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

    // 1. I-compute ang mga ibabawas
    const deductions = recipe.recipe_ingredients.map(ri => ({
      item_type: ri.item_type,
      item_name: ri.item_name,
      quantity:  +(ri.quantity * body.batches).toFixed(4),
      unit:      ri.unit,
    }));

    // 2. I-save ang production log
    const { data: log, error: logErr } = await ProductionModel.create(body);
    if (logErr) throw logErr;

    // 3. I-save ang listahan ng deductions
    const { error: deductErr } = await ProductionModel.insertDeductions(log.id, deductions);
    if (deductErr) throw deductErr;

    // 4. Bawasan ang actual stock sa database at MAG-LOG SA HISTORY
    for (const d of deductions) {
      if (d.item_type === 'raw') {
        await IngredientModel.deductByName(d.item_name, d.quantity);
      } else {
        await MaterialModel.deductByName(d.item_name, d.quantity);
      }

      await InventoryLogModel.logHistory({
        item_type: d.item_type,          
        item_name: d.item_name,
        transaction_type: 'OUT',         
        quantity: d.quantity,
        cost: 0,                         
        action: 'Production'             
      });
    }


    console.log('DEBUG supabase.from:', supabase.from.toString().slice(0, 100));
console.log('DEBUG is mocked:', typeof supabase.from.mock !== 'undefined');
    // 5. 👉 IDAGDAG ANG STOCK SA PRODUCTS TABLE PARA SA POS ("Buy Now")
    const { data: prodData } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', body.product_id)
      .single();

    if (prodData) {
      const newProductStock = (prodData.stock_quantity || 0) + Number(body.total_produced);
      await supabase
        .from('products')
        .update({ stock_quantity: newProductStock })
        .eq('id', body.product_id);
    }

    return log;
  },

  // Ito ang function para malaman ang kailangang stock para sa future orders
  getRequirementsForOrders: async (startDate, endDate) => {
    // 1. Kunin lahat ng 'Confirmed' pre-orders sa date range
    const { data: orders } = await supabase
      .from('orders')
      .select('id, pickup_date, order_items(*)')
      .eq('order_type', 'Pre-Order')
      .eq('status', 'Confirmed')
      .gte('pickup_date', startDate)
      .lte('pickup_date', endDate);

    const requirements = {};

    // 2. I-compute ang total ingredients base sa recipes
    for (const order of orders) {
      for (const item of order.order_items) {
        const { data: recipe } = await RecipeModel.findWithIngredientsByProductId(item.product_id);
        if (!recipe) continue;

        for (const ri of recipe.recipe_ingredients) {
          const totalQty = ri.quantity * item.quantity;
          if (!requirements[ri.item_name]) {
            requirements[ri.item_name] = { name: ri.item_name, total: 0, unit: ri.unit };
          }
          requirements[ri.item_name].total += totalQty;
        }
      }
    }
    return requirements;
  },

};

module.exports = { ProductionService };