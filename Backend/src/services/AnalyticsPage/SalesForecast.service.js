const analyticsModel = require("../../model/analytics.model.js");

const SalesForecastService = {
  async getSalesTrendsByTimeframe(timeframe) {
    const result = await analyticsModel.getSalesForecasts(timeframe);
    return result;
  }
};

module.exports = SalesForecastService;