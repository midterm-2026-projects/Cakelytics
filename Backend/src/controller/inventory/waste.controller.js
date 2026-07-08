const { WasteService } = require('../../services/inventory/waste.service.js');
const { ok, created } = require('../../utils/response.js');
const { WasteLogSchema } = require('../../schemas/index.js');

const WasteController = {
  getAll: async (req, res, next) => {
    try {
      const limit = Math.min(100, parseInt(req.query.limit) || 50);
      ok(res, await WasteService.getAll(limit));
    } catch (err) { next(err); }
  },
  log: async (req, res, next) => {
    try {
      const body = WasteLogSchema.parse(req.body);
      created(res, await WasteService.log(body), 'Waste logged');
    } catch (err) { next(err); }
  },
};

module.exports = { WasteController };