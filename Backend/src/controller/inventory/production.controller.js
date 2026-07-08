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
};

module.exports = { ProductionController };