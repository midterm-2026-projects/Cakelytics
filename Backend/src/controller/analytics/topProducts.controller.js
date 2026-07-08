const TopProductsService = require('../../../src/services/AnalyticsPage/TopProducts.service.js');
const { ok } = require('../../utils/response.js');

const TopProductsController = {
  getTopProducts: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      const result = await TopProductsService.getTopProductsByTimeframe(timeframe);
      
      ok(res, result, 'Top products fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { TopProductsController };