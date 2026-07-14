const { ProductionService } = require('../../services/inventory/production.service.js');
const { ok, created } = require('../../utils/response.js');
const { ConfirmBatchSchema } = require('../../schemas/index.js');

const ProductionController = {
  getAll: async (req, res, next) => {
    try {
      const limit = Math.min(100, parseInt(req.query.limit) || 50);
      ok(res, await ProductionService.getAll(limit));
    } catch (err) { next(err); }
  },
  confirmBatch: async (req, res, next) => {
    try {
      const body = ConfirmBatchSchema.parse(req.body);
      created(res, await ProductionService.confirmBatch(body), 'Production batch logged');
    } catch (err) { next(err); }
  },

  getShoppingList: async (req, res, next) => {
    try {
      // Kunin ang data para sa susunod na 7 araw (halimbawa lang)
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      ok(res, await ProductionService.getRequirementsForOrders(startDate, endDate));
    } catch (err) { next(err); }
  },
};

module.exports = { ProductionController };