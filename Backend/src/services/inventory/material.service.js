const { MaterialModel } = require('../../model/inventory.model.js');
const { AppError } = require('../../middleware/errorHandler.js');

// CELEBRATION MATERIALS
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
    if (error || !data) throw new AppError('Material not found', 404);
    return data;
  },

  restock: async (id, qty) => {
    const { data: current, error: findErr } = await MaterialModel.findById(id);
    if (findErr || !current) throw new AppError('Material not found', 404);

    const { data, error } = await MaterialModel.setStock(id, current.stock_quantity + qty);
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await MaterialModel.delete(id);
    if (error) throw error;
  },
};

module.exports = { MaterialService };