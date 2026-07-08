const { FourKpiModel } = require('../../../src/model/analytics/fourKPI.model.js');

async function getKpiByTimeframe(timeframe) {
  try {
    const result = await FourKpiModel.getKpiByTimeframe(timeframe);
    
    // Pwede ka magdagdag ng custom error handling dito kung kailangan,
    // pero dahil nagt-throw na ng error yung model mo, sasaluhin na 'to 
    // ng catch block sa controller at ipapasa sa global error handler.
    if (!result) {
      const err = new Error('No KPI data found for the selected timeframe');
      err.statusCode = 404;
      throw err;
    }

    return result;
  } catch (error) {
    throw error;
  }
}

const FourKpiService = { getKpiByTimeframe };

module.exports = { getKpiByTimeframe, FourKpiService };