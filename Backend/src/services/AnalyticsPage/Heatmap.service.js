const analyticsModel = require("../../model/analytics.model.js");

const HeatmapService = {
  async getOrderVolumeByTimeframe(timeframe) {
    const result = await analyticsModel.getOrderVolumeByTimeframe(timeframe);
    return result;
  }
};

module.exports = HeatmapService;