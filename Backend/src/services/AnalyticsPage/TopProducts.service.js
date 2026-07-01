import analyticsModel from "../../model/analytics.model.js";

export default {
  async getTopProductsByTimeframe(timeframe) {
    const result = await analyticsModel.getTopProductsByTimeframe(timeframe);

    if (!result) {
      throw new Error("AppError");
    }

    return result.slice(0, 5);
  }
}