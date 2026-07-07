import analyticsModel from "../../model/analytics.model.js";

export default {
  async getSalesTrendsByTimeframe(timeframe) {
    const result = await analyticsModel.getSalesForecasts(timeframe);
    return result;
  }
};