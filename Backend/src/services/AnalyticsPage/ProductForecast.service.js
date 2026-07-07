import analyticsModel from "../../model/analytics.model.js"

export default {
  async getProductTrendsByTimeframe(timeframe){
    const result = await analyticsModel.getProductForecasts(timeframe);
    return result;
  }
}