const HeatmapService = require('../../../src/services/AnalyticsPage/Heatmap.service.js');
const { ok } = require('../../utils/response.js');

const HeatmapController = {
  getHeatmapData: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      const result = await HeatmapService.getOrderVolumeByTimeframe(timeframe);
      
      ok(res, result, 'Heatmap data fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { HeatmapController };