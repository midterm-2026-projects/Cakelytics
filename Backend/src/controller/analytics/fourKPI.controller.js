const { FourKpiService } = require('../../../src/services/AnalyticsPage/FourKPI.service.js'); // Or depende kung paano mo in-export
const { ok } = require('../../utils/response.js');

const FourKpiController = {
  getKpiByTimeframe: async (req, res, next) => {
    try {
      // Kukunin yung timeframe parameter na sinet natin sa routes (req.params)
      const { timeframe } = req.params;
      
      const result = await FourKpiService.getKpiByTimeframe(timeframe);
      ok(res, result, 'KPI data fetched successfully');
    } catch (err) {
      // Ipapasa sa global error handler kung may mag-fail sa database query
      next(err); 
    }
  },
};

module.exports = { FourKpiController };