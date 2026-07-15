const router = require('express').Router();

// Isang import na lang galing sa pinagsamang analytics.controller.js
const {
  ActionableRecommendationController,
  FourKpiController,
  HeatmapController,
  ProductForecastController,
  SalesForecastController,
  StackedBarController,
  TopProductsController
} = require('../controller/analytics.controller');

// ==========================================
// Analytics Routes
// ==========================================

// Actionable Recommendations
router.get('/actionable-recommendations', ActionableRecommendationController.getActionableRecommendations);

// Four KPI
router.get('/four-kpi/:timeframe', FourKpiController.getKpiByTimeframe);

// Heatmap
router.get('/heatmap/:timeframe', HeatmapController.getHeatmapData);

// Product Forecast
router.get('/product-forecast/:timeframe', ProductForecastController.getProductForecastByTimeframe);

// Sales Forecast
router.get('/sales-forecast/:timeframe', SalesForecastController.getSalesForecastByTimeframe);

// Stacked Bar
router.get('/stacked-bar/:timeframe', StackedBarController.getStackedBarByTimeframe);

// Top Products
router.get('/top-products/:timeframe', TopProductsController.getTopProducts);

module.exports = router;