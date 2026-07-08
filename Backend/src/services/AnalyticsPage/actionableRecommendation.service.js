const analyticsModel = require("../../model/analytics.model.js");

const ActionableRecommendationService = {
  async getActionableRecommendations() {
    const result = await analyticsModel.getActionableRecommendations();
    return result;
  }
};

module.exports = ActionableRecommendationService;