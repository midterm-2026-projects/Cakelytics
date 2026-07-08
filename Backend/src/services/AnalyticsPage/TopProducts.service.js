const analyticsModel = require("../../model/analytics.model.js");

const TopProductsService = {
  async getTopProductsByTimeframe(timeframe) {
    const result = await analyticsModel.getTopProductsByTimeframe(timeframe);
    if (!result) {
      throw new Error("AppError");
    }
    return result.slice(0, 5);
  }
};

module.exports = TopProductsService;