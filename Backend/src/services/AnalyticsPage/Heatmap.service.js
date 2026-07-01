import analyticsModel from "../../model/analytics.model"

export default {
  async getOrderVolumeByTimeframe(timeframe){
    const result = await analyticsModel.getOrderVolumeByTimeframe(timeframe);
    return result;
  }
}