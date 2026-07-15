const cron = require('node-cron');
const {
  ActionableRecommendationService,
  ProductForecastService,
  SalesForecastService
} = require('../services/analytics.service.js');

const setupAnalyticsCron = (
  scheduler = cron,
  services = {
    actionableRecommendationService: ActionableRecommendationService,
    productForecastService: ProductForecastService,
    salesForecastService: SalesForecastService,
  }
) => {
  scheduler.schedule('0 0 * * *', async () => {
    console.log('--- Cron Job Started: Refreshing AI Analytics ---');

    try {
      await services.actionableRecommendationService.getActionableRecommendations(true);

      const timeframes = ['7d', '30d', '60d'];
      for (const t of timeframes) {
        await services.productForecastService.getProductTrendsByTimeframe(t, true);
        await services.salesForecastService.getSalesTrendsByTimeframe(t, true);
      }

      console.log('--- Cron Job Finished: All analytics cached ---');
    } catch (error) {
      console.error('--- Cron Job Failed: ---', error);
    }
  });
};

module.exports = { setupAnalyticsCron };