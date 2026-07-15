require('dotenv').config();
const request = require('supertest');
const express = require('express');

// ==========================================
// Imports (Unified Routes & Services)
// ==========================================
const analyticsRoutes = require('../../../src/routes/analytics.routes.js'); // I-adjust ang path kung kinakailangan
const { errorHandler } = require('../../../src/middleware/errorHandler.js');

const {
  ActionableRecommendationService,
  FourKpiService,
  HeatmapService,
  ProductForecastService,
  SalesForecastService,
  StackedBarServices,
  TopProductsService
} = require('../../../src/services/analytics.service.js'); // Shared service file

// ==========================================
// Express App Setup
// ==========================================
const app = express();
app.use(express.json());

// Mock Auth Middleware
app.use((req, res, next) => {
  if (req.headers.authorization !== 'Bearer valid-token') {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or missing token' });
  }
  next();
});

app.use('/api', analyticsRoutes);
app.use(errorHandler);


// ==========================================
// 1. Actionable Recommendation Routes Integration
// ==========================================
describe('Actionable Recommendation Routes Integration', () => {
  const fakeRecommendations = {
    recommendations: [
      { badge: 'WARNING', title: 'Low Flour Stock', desc: 'Restock flour immediately.', type: 'danger' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/actionable-recommendations');
    expect(res.status).toBe(401);
  });

  // TEST 2: Successful Fetch (200 OK)
  it('should return 200 and fetch cached recommendations successfully', async () => {
    vi.spyOn(ActionableRecommendationService, 'getActionableRecommendations').mockResolvedValue(fakeRecommendations);

    const res = await request(app)
      .get('/api/actionable-recommendations')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    // false = hindi pinilit i-refresh ang AI, kukuha muna sa cache
    expect(ActionableRecommendationService.getActionableRecommendations).toHaveBeenCalledWith(false); 
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no recommendations are found', async () => {
    const notFoundErr = new Error('Walang nakitang actionable recommendations');
    notFoundErr.statusCode = 404;

    vi.spyOn(ActionableRecommendationService, 'getActionableRecommendations').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/actionable-recommendations')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database/Service Failure (500 Internal Server Error)
  it('should return 500 when the database or service fails unexpectedly', async () => {
    vi.spyOn(ActionableRecommendationService, 'getActionableRecommendations').mockRejectedValue(new Error('System error'));

    const res = await request(app)
      .get('/api/actionable-recommendations')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });

  // TEST 5: GEMINI AI MOCK (Force Refresh)
  it('should return 500 when the cache retrieval fails unexpectedly', async () => {
    vi.spyOn(ActionableRecommendationService, 'getActionableRecommendations').mockRejectedValue(new Error('System error'));

    const res = await request(app)
      .get('/api/actionable-recommendations')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});


// ==========================================
// 2. FourKPI Routes Integration
// ==========================================
describe('FourKPI Routes Integration', () => {
  const PERFORMANCE_TIMEFRAMES = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last Month', // In-update mula sa Last 30 Days para mag-match sa utils
    'This Month',
    'This Year',
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/four-kpi/Today'); // Walang authorization header
    expect(res.status).toBe(401);
  });

  // TEST 2: All Timeframes (200 OK)
  it.each(PERFORMANCE_TIMEFRAMES)('should return 200 for valid timeframe "%s"', async (timeframe) => {
    const fakeResult = { totalSales: 1000, totalExpenses: 400, grossProfit: 600, profitMargin: 60 };
    vi.spyOn(FourKpiService, 'getKpiByTimeframe').mockResolvedValue(fakeResult);

    const res = await request(app)
      .get(`/api/four-kpi/${encodeURIComponent(timeframe)}`)
      .set('Authorization', 'Bearer valid-token'); // May tamang token

    expect(res.status).toBe(200);
    expect(FourKpiService.getKpiByTimeframe).toHaveBeenCalledWith(timeframe);
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no KPI data is found', async () => {
    // I-simulate yung totoong ginagawa ng service mo kapag walang data: nag-throw ng 404 error
    const notFoundErr = new Error('Walang nakitang KPI data para sa timeframe na: Today');
    notFoundErr.statusCode = 404;
    
    vi.spyOn(FourKpiService, 'getKpiByTimeframe').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/four-kpi/Today')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database Failure (500 Internal Server Error)
  it('should return 500 when the database fails unexpectedly', async () => {
    vi.spyOn(FourKpiService, 'getKpiByTimeframe').mockRejectedValue(new Error('Database connection lost'));

    const res = await request(app)
      .get('/api/four-kpi/Today')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});


// ==========================================
// 3. Heatmap Routes Integration
// ==========================================
describe('Heatmap Routes Integration', () => {
  const WEEK_START_CASES = [
    { label: 'a Monday week start', weekStart: '2026-07-06' },
    { label: 'a mid-week date (Wednesday)', weekStart: '2026-07-08' },
    { label: 'a week start that crosses a month boundary', weekStart: '2026-07-27' },
    { label: 'a week start that crosses a year boundary', weekStart: '2025-12-29' },
  ];
  
  // 8 time slots x 7 days, matching buildHeatmapMatrix's output shape
  const fakeMatrix = Array.from({ length: 8 }, () => Array(7).fill(0));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/heatmap/2026-07-06');
    expect(res.status).toBe(401);
  });

  // TEST 2: All Timeframes (200 OK)
  it.each(WEEK_START_CASES)('should return 200 and an 8x7 matrix for $label', async ({ weekStart }) => {
    vi.spyOn(HeatmapService, 'getOrderVolumeByTimeframe').mockResolvedValue(fakeMatrix);

    const res = await request(app)
      .get(`/api/heatmap/${encodeURIComponent(weekStart)}`)
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(HeatmapService.getOrderVolumeByTimeframe).toHaveBeenCalledWith(weekStart);
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no heatmap data is found', async () => {
    const notFoundErr = new Error('Walang nakitang heatmap data para sa linggong ito');
    notFoundErr.statusCode = 404;

    vi.spyOn(HeatmapService, 'getOrderVolumeByTimeframe').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/heatmap/2026-07-06')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database Failure (500 Internal Server Error)
  it('should return 500 when the database fails unexpectedly', async () => {
    vi.spyOn(HeatmapService, 'getOrderVolumeByTimeframe').mockRejectedValue(new Error('Failed to fetch heatmap data from database'));

    const res = await request(app)
      .get('/api/heatmap/2026-07-06')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});


// ==========================================
// 4. ProductForecast Routes Integration
// ==========================================
describe('ProductForecast Routes Integration', () => {
  const FORECAST_TIMEFRAMES = ['7d', '30d', '60d'];
  
  const fakePayload = {
    label: 'Next 30 Days',
    growth: [{ name: 'Chocolate Cake', pct: 20, diff: 10, forecast: 60 }],
    risk: [{ name: 'Fruit Tart', pct: -15, diff: -5, forecast: 20 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/product-forecast/30d');
    expect(res.status).toBe(401);
  });

  // TEST 2: All Timeframes (200 OK)
  it.each(FORECAST_TIMEFRAMES)('should return 200 for timeframe "%s"', async (timeframe) => {
    vi.spyOn(ProductForecastService, 'getProductTrendsByTimeframe').mockResolvedValue(fakePayload);

    const res = await request(app)
      .get(`/api/product-forecast/${timeframe}`)
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    // Default call ay false (gumagamit ng cache)
    expect(ProductForecastService.getProductTrendsByTimeframe).toHaveBeenCalledWith(timeframe, false);
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no product forecast data is found', async () => {
    const notFoundErr = new Error('Walang nakitang product forecast data');
    notFoundErr.statusCode = 404;

    vi.spyOn(ProductForecastService, 'getProductTrendsByTimeframe').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/product-forecast/30d')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database/Service Failure (500 Internal Server Error)
  it('should return 500 when the database or service fails unexpectedly', async () => {
    vi.spyOn(ProductForecastService, 'getProductTrendsByTimeframe').mockRejectedValue(new Error('System error'));

    const res = await request(app)
      .get('/api/product-forecast/30d')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });

  // TEST 5: GEMINI AI MOCK (Force Refresh)
  it('should return 500 when the cache retrieval fails unexpectedly', async () => {
    vi.spyOn(ProductForecastService, 'getProductTrendsByTimeframe').mockRejectedValue(new Error('System error'));

    const res = await request(app)
      .get('/api/product-forecast/30d')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});


// ==========================================
// 5. SalesForecast Routes Integration
// ==========================================
describe('SalesForecast Routes Integration', () => {
  const FORECAST_TIMEFRAMES = ['7d', '30d', '60d'];

  const fakePayload = {
    chartData: [
      { label: 'Jul 8', isToday: true, actualSales: 1500, forecastSales: 1500 },
      { label: 'Jul 9', isToday: false, actualSales: null, forecastSales: 1600 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/sales-forecast/30d');
    expect(res.status).toBe(401);
  });

  // TEST 2: All Timeframes (200 OK)
  it.each(FORECAST_TIMEFRAMES)('should return 200 for timeframe "%s"', async (timeframe) => {
    vi.spyOn(SalesForecastService, 'getSalesTrendsByTimeframe').mockResolvedValue(fakePayload);

    const res = await request(app)
      .get(`/api/sales-forecast/${timeframe}`)
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(SalesForecastService.getSalesTrendsByTimeframe).toHaveBeenCalledWith(timeframe, false);
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no sales forecast data is found', async () => {
    const notFoundErr = new Error('Walang nakitang sales forecast data');
    notFoundErr.statusCode = 404;

    vi.spyOn(SalesForecastService, 'getSalesTrendsByTimeframe').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/sales-forecast/30d')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database/Service Failure (500 Internal Server Error)
  it('should return 500 when the database or service fails unexpectedly', async () => {
    vi.spyOn(SalesForecastService, 'getSalesTrendsByTimeframe').mockRejectedValue(new Error('System error'));

    const res = await request(app)
      .get('/api/sales-forecast/30d')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });

  it('should return 500 when the cache retrieval fails unexpectedly', async () => {
    vi.spyOn(SalesForecastService, 'getSalesTrendsByTimeframe').mockRejectedValue(new Error('System error'));

    const res = await request(app)
      .get('/api/sales-forecast/30d')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});


// ==========================================
// 6. StackedBar Routes Integration
// ==========================================
describe('StackedBar Routes Integration', () => {
  const PERFORMANCE_TIMEFRAMES = ['Today', 'Yesterday', 'Last 7 Days', 'Last Month', 'This Month', 'This Year'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/stacked-bar/Today');
    expect(res.status).toBe(401);
  });

  // TEST 2: All Timeframes (200 OK)
  it.each(PERFORMANCE_TIMEFRAMES)('should return 200 for valid timeframe "%s"', async (timeframe) => {
    const fakeResult = [{ label: '10 AM', Sales: 1500, Expenses: 500, Profit: 1000 }];
    
    // PINALITAN: Spied on StackedBarService (root export) na ginagamit ng controller
    vi.spyOn(StackedBarServices, 'getStackedBarByTimeframe').mockResolvedValue(fakeResult);

    const res = await request(app)
      .get(`/api/stacked-bar/${encodeURIComponent(timeframe)}`)
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(StackedBarServices.getStackedBarByTimeframe).toHaveBeenCalledWith(timeframe);
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no stacked bar data is found', async () => {
    // PINALITAN: Explicit na nag-throw ng 404 error katulad ng sa FourKPI test
    const notFoundErr = new Error('Walang nakitang Stacked Bar data');
    notFoundErr.statusCode = 404;
    
    vi.spyOn(StackedBarServices, 'getStackedBarByTimeframe').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/stacked-bar/Today')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database Failure (500 Internal Server Error)
  it('should return 500 when the database fails unexpectedly', async () => {
    vi.spyOn(StackedBarServices, 'getStackedBarByTimeframe').mockRejectedValue(new Error('Supabase error'));

    const res = await request(app)
      .get('/api/stacked-bar/Today')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});


// ==========================================
// 7. TopProducts Routes Integration
// ==========================================
describe('TopProducts Routes Integration', () => {
  const PERFORMANCE_TIMEFRAMES = ['Today', 'Yesterday', 'Last 7 Days', 'Last Month', 'This Month', 'This Year'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Token Validation (401 Unauthorized)
  it('should return 401 when the token is missing or invalid', async () => {
    const res = await request(app).get('/api/top-products/Today');
    expect(res.status).toBe(401);
  });

  // TEST 2: All Timeframes (200 OK)
  it.each(PERFORMANCE_TIMEFRAMES)('should return 200 for valid timeframe "%s"', async (timeframe) => {
    const fakeResult = [{ name: 'Chocolate Cake', sold: 42 }];
    vi.spyOn(TopProductsService, 'getTopProductsByTimeframe').mockResolvedValue(fakeResult);

    const res = await request(app)
      .get(`/api/top-products/${encodeURIComponent(timeframe)}`)
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(TopProductsService.getTopProductsByTimeframe).toHaveBeenCalledWith(timeframe);
  });

  // TEST 3: No Data Found (404 Not Found)
  it('should return 404 when no top products are found', async () => {
    // Explicit na nag-throw ng 404 error katulad ng ginawa natin sa FourKPI at StackedBar
    const notFoundErr = new Error('Walang nakitang top products');
    notFoundErr.statusCode = 404;
    
    vi.spyOn(TopProductsService, 'getTopProductsByTimeframe').mockRejectedValue(notFoundErr);

    const res = await request(app)
      .get('/api/top-products/Today')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(404);
  });

  // TEST 4: Database Failure (500 Internal Server Error)
  it('should return 500 when the database fails unexpectedly', async () => {
    vi.spyOn(TopProductsService, 'getTopProductsByTimeframe').mockRejectedValue(new Error('Failed to fetch top products'));

    const res = await request(app)
      .get('/api/top-products/Today')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(500);
  });
});