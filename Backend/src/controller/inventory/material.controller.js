const { MaterialService } = require('../../services/inventory/material.service.js');
const { ok, created } = require('../../utils/response.js');
const { StockItemSchema, UpdateStockItemSchema, RestockSchema } = require('../../schemas/index.js');

const MaterialController = {
  getAll: async (_req, res, next) => {
    try { ok(res, await MaterialService.getAll()); }
    catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const body = StockItemSchema.parse(req.body);
      created(res, await MaterialService.create(body), 'Material added');
    } catch (err) { next(err); }
  },
  update: async (req, res, next) => {
    try {
      const body = UpdateStockItemSchema.parse(req.body);
      ok(res, await MaterialService.update(req.params.id, body), 'Material updated');
    } catch (err) { next(err); }
  },
  restock: async (req, res, next) => {
    try {
      // const { qty } = RestockSchema.parse(req.body);
      ok(res, await MaterialService.restock(req.params.id, req.body), 'Restocked');
    } catch (err) { next(err); }
  },
  delete: async (req, res, next) => {
    try {
      await MaterialService.delete(req.params.id);
      ok(res, null, 'Material deleted');
    } catch (err) { next(err); }
  },
};

module.exports = { MaterialController };