const StackedBarService = require('../../../src/services/AnalyticsPage/StackedBar.service.js');
const { ok } = require('../../utils/response.js');

const StackedBarController = {
  getStackedBarByTimeframe: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      
      const result = await StackedBarService.getStackedBarByTimeframe(timeframe);
      ok(res, result, 'Stacked Bar data fetched successfully');
    } catch (err) {
      next(err); 
    }
  },
};

module.exports = { StackedBarController };