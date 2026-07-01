import analyticsModel from "../../model/analytics.model"

export default {
  async getKpiByTimeframe(timeframe){
    const result = await analyticsModel.getKpiByTimeframe(timeframe);
    return result;
  }
}