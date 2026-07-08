// Gumamit ng require at ituro sa tamang model file (stackedBar.model.js)
const { StackedBarModel } = require("../../../src/model/analytics/stackedBar.model.js");

async function getStackedBarByTimeframe(timeframe) {
  try {
    const result = await StackedBarModel.getStackedBarByTimeframe(timeframe);
    return result;
  } catch (error) {
    throw error;
  }
}

const StackedBarServices = { getStackedBarByTimeframe };

module.exports = { getStackedBarByTimeframe, StackedBarServices };