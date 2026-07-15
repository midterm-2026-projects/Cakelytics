require('dotenv').config();

const ActionableRecommendationService = require('../src/services/AnalyticsPage/actionableRecommendation.service.js');
const ProductForecastService = require('../src/services/AnalyticsPage/ProductForecast.service.js');
const SalesForecastService = require('../src/services/AnalyticsPage/SalesForecast.service.js');

const TIMEFRAMES = ['7d', '30d', '60d'];

async function seedAnalyticsCache() {
  console.log('--- Manual seed started: refreshing AI analytics cache ---');

  try {
    console.log('[1/3] Actionable Recommendations...');
    const rec = await ActionableRecommendationService.getActionableRecommendations(true);
    console.log(`      -> ${rec.recommendations.length} recommendations cached.`);

    for (const t of TIMEFRAMES) {
      console.log(`[2/3] Product Forecast (${t})...`);
      const pf = await ProductForecastService.getProductTrendsByTimeframe(t, true);
      console.log(`      -> growth: ${pf.growth.length}, risk: ${pf.risk.length}`);

      console.log(`[3/3] Sales Forecast (${t})...`);
      const sf = await SalesForecastService.getSalesTrendsByTimeframe(t, true);
      console.log(`      -> ${sf.chartData.length} chart points`);
    }

    console.log('--- Manual seed finished: analytics_cache is now populated ---');
    process.exit(0);
  } catch (err) {
    console.error('--- Manual seed FAILED: ---', err);
    process.exit(1);
  }
}

seedAnalyticsCache();