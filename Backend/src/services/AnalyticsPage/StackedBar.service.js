import analyticsModel from "../../model/analytics.model.js"

export default {
  async getStackedBarByTimeframe(timeframe){
    const result = await analyticsModel.getStackedBarByTimeframe(timeframe);
    return result;
  }
}