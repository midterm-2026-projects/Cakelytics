const analyticsModel = require("../../model/analytics.model.js");

const ProductForecastService = {
  async getProductTrendsByTimeframe(timeframe) {
    const result = await analyticsModel.getProductForecasts(timeframe);
    return result;
  }
};

module.exports = ProductForecastService;