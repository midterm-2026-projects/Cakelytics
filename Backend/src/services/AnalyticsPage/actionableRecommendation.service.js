import analyticsModel from "../../model/analytics.model.js";

export default {
  async getRecommendations() {
    const result = await analyticsModel.getActionableRecommendations();
    return result;
  }
};