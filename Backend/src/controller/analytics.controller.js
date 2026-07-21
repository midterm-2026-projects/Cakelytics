const { ok } = require('../utils/response.js');
const { 
  ActionableRecommendationService, 
  FourKpiService, 
  ProductForecastService, 
  SalesForecastService, 
  StackedBarServices, 
  TopProductsService 
} = require('../services/analytics.service.js');

// ==========================================
// Controllers
// ==========================================

const ActionableRecommendationController = {
  getActionableRecommendations: async (req, res, next) => {
    try {
      const forceRefresh = req.query.refresh === 'true';

      const result = await ActionableRecommendationService.getActionableRecommendations(forceRefresh);
      ok(res, result, 'Actionable recommendations fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

const FourKpiController = {
  getKpiByTimeframe: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      const result = await FourKpiService.getKpiByTimeframe(timeframe);

      ok(res, result, 'KPI data fetched successfully');
    } catch (err) {
      next(err); 
    }
  },
};

const ProductForecastController = {
  getProductForecastByTimeframe: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      const forceRefresh = req.query.refresh === 'true';

      const result = await ProductForecastService.getProductTrendsByTimeframe(timeframe, forceRefresh);
      ok(res, result, 'Product forecast fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

const SalesForecastController = {
  getSalesForecastByTimeframe: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      const forceRefresh = req.query.refresh === 'true';

      const result = await SalesForecastService.getSalesTrendsByTimeframe(timeframe, forceRefresh);
      ok(res, result, 'Sales forecast fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};

const StackedBarController = {
  getStackedBarByTimeframe: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      
      const result = await StackedBarServices.getStackedBarByTimeframe(timeframe);
      ok(res, result, 'Stacked Bar data fetched successfully');
    } catch (err) {
      next(err); 
    }
  },
};

const TopProductsController = {
  getTopProducts: async (req, res, next) => {
    try {
      const { timeframe } = req.params;
      const result = await TopProductsService.getTopProductsByTimeframe(timeframe);
      
      ok(res, result, 'Top products fetched successfully');
    } catch (err) {
      next(err);
    }
  },
};
module.exports = {
  ActionableRecommendationController,
  FourKpiController,
  ProductForecastController,
  SalesForecastController,
  StackedBarController,
  TopProductsController
};