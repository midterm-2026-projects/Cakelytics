import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';


vi.mock('../../../src/utils/analytics/', () => ({
  callGeminiJSON: vi.fn(),
}));

const {
  ActionableRecommendationService,
  FourKpiService,
  HeatmapService: heatmapService,
  ProductForecastService: productForecastService,
  SalesForecastService: salesForecastService,
  StackedBarServices,
  TopProductsService,
} = require('../../../src/services/analytics.service.js');

const AnalyticsCacheModel = require('../../../src/model/analyticsCache.model.js');
const OrdersModel = require('../../../src/model/orders.model.js');
const { InventoryLogModel: InventoryLogsModel } = require("../../../src/model/inventoryLog.model.js");
const OrderItemsModel = require('../../../src/model/orderItems.model.js');


// ==========================================
// 1. ACTIONABLE RECOMMENDATION TESTS
// ==========================================
describe('ActionableRecommendation Service', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should return actionable recommendations when fetch is successful', async () => {
    const mockData = [
      { badge: "PROMO", title: "Increase stock for Package B", desc: "Action plan", type: "info" }
    ];

    // Mock the cache check to return our mock payload immediately, avoiding Gemini API calls
    vi.spyOn(AnalyticsCacheModel, 'getByKey').mockResolvedValue({
      expires_at: new Date(Date.now() + 10000).toISOString(),
      payload: mockData
    });

    const result = await ActionableRecommendationService.getActionableRecommendations();

    expect(AnalyticsCacheModel.getByKey).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });
});


// ==========================================
// 2. FOUR KPI TESTS
// ==========================================
describe('FourKPI.services', () => {
  beforeEach(() => {
    // Linisin at ibalik sa orihinal ang lahat ng na-spy bago mag-start ang bawat test
    vi.restoreAllMocks();
  });

  it('should return computed KPI data (Sales, Expenses, Profit, Margin) including deltas', async () => {
    // Gamitin ang vi.spyOn nang direkta sa required object.
    // Dahil pareho silang require, ito ay guaranteed na ma-i-intercept at hindi pupunta sa totoong DB.
    vi.spyOn(OrdersModel, 'getByDateRange').mockResolvedValue([{ grand_total: 1000 }]);
    vi.spyOn(InventoryLogsModel, 'getByDateRange').mockResolvedValue([{ transaction_type: 'IN', cost: 400 }]);

    const result = await FourKpiService.getKpiByTimeframe("This Month");

    expect(result).toEqual({
      totalSales: 1000,
      sDelta: 0,
      totalExpenses: 400,
      eDelta: 0,
      grossProfit: 600,
      pDelta: 0,
      profitMargin: 60,
      mDelta: 0,
    });
  });

  it('should call the models when fetching data', async () => {
    // Same process, i-spy at i-mock ang return value bilang empty array
    const spyOrders = vi.spyOn(OrdersModel, 'getByDateRange').mockResolvedValue([]);
    const spyInventoryLogs = vi.spyOn(InventoryLogsModel, 'getByDateRange').mockResolvedValue([]);

    await FourKpiService.getKpiByTimeframe("This Month");

    // Dapat mabilang na ito nang tama bilang 2
    expect(spyOrders).toHaveBeenCalledTimes(2);
    expect(spyInventoryLogs).toHaveBeenCalledTimes(2);
  });
});


// ==========================================
// 4. PRODUCT FORECAST SERVICE TESTS
// ==========================================
describe('Product Forecasting Service', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should fetch per-product forecast data and correctly map each product to its predicted demand/stock figures for the given timeframe.', async () => {
    const timeframe = '30d';

    const mockPayload = {
      label: "Next 30 Days",
      growth: [
        { name: 'Mocha Dedication Cake', forecast: 92, pct: 15, diff: 10 }
      ],
      risk: []
    };

    vi.spyOn(AnalyticsCacheModel, 'getByKey').mockResolvedValue({
      expires_at: new Date(Date.now() + 10000).toISOString(),
      payload: mockPayload
    });

    const result = await productForecastService.getProductTrendsByTimeframe(timeframe);

    expect(AnalyticsCacheModel.getByKey).toHaveBeenCalledWith(`product_forecast:${timeframe}`);
    expect(result.growth[0]).toHaveProperty('name', 'Mocha Dedication Cake');
    expect(result.growth[0]).toHaveProperty('forecast', 92);
  });
});


// ==========================================
// 5. SALES FORECAST SERVICE TESTS
// ==========================================
describe('Sales Forecast Service', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it(' It should fetch historical and projected sales data scoped to the selected timeframe parameter.', async () => {
    const timeframe = '30d';

    const mockPayload = {
      chartData: [
        { label: 'Jul 1', isToday: false, actualSales: 15000, forecastSales: null },
        { label: 'Jul 15', isToday: false, actualSales: null, forecastSales: 16200 }
      ]
    };

    vi.spyOn(AnalyticsCacheModel, 'getByKey').mockResolvedValue({
      expires_at: new Date(Date.now() + 10000).toISOString(),
      payload: mockPayload
    });

    const result = await salesForecastService.getSalesTrendsByTimeframe(timeframe);

    expect(AnalyticsCacheModel.getByKey).toHaveBeenCalledWith(`sales_forecast:${timeframe}`);
    expect(result.chartData).toEqual(mockPayload.chartData);
    expect(result.chartData[0]).toHaveProperty('actualSales');
    expect(result.chartData[0]).toHaveProperty('forecastSales');
  });
});


// ==========================================
// 6. STACKED BAR SERVICE TESTS
// ==========================================
describe("StackedBar.services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return grouped chart data (Sales, Expenses, Profit) when model fetch is successful", async () => {
    const mockOrders = [
      { grand_total: 1500, status: 'Completed', updated_at: '2026-07-10T10:30:00' }
    ];

    const mockInventoryLogs = [
      { transaction_type: 'IN', cost: 500, created_at: '2026-07-10T10:15:00' },
      { transaction_type: 'OUT', action: 'Waste', cost: 100, created_at: '2026-07-10T11:00:00' } // Dapat hindi masama sa expenses
    ];

    vi.spyOn(OrdersModel, "getByDateRange").mockResolvedValue(mockOrders);
    vi.spyOn(InventoryLogsModel, "getByDateRange").mockResolvedValue(mockInventoryLogs);

    // 2. Patakbuhin ang service para sa "Today"
    const result = await StackedBarServices.getStackedBarByTimeframe("Today");

    // 3. I-check kung tama ang pag-group ng data sa "10 AM" na label
    // Expected Sales: 1500
    // Expected Expenses: 500 ('IN' lang)
    // Expected Profit: 1500 - 500 = 1000
    const tenAmData = result.find(item => item.label === '10 AM');

    expect(tenAmData).toBeDefined();
    expect(tenAmData).toEqual({
      label: '10 AM',
      Sales: 1500,
      Expenses: 500,
      Profit: 1000
    });

    // 4. (Optional) Siguraduhing 0 ang value ng ibang oras (halimbawa, 8 AM)
    const eightAmData = result.find(item => item.label === '8 AM');
    expect(eightAmData).toEqual({
      label: '8 AM',
      Sales: 0,
      Expenses: 0,
      Profit: 0
    });
  });

  it("should call the models with the correct parameters", async () => {
    const spyOrders = vi.spyOn(OrdersModel, "getByDateRange").mockResolvedValue([]);
    const spyInventoryLogs = vi.spyOn(InventoryLogsModel, "getByDateRange").mockResolvedValue([]);

    await StackedBarServices.getStackedBarByTimeframe("This Month");

    expect(spyOrders).toHaveBeenCalledTimes(1);
    expect(spyInventoryLogs).toHaveBeenCalledTimes(1);
  });
});


// ==========================================
// 7. TOP PRODUCTS SERVICE TESTS
// ==========================================
describe('TopProducts.services', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('It should return only the top 5 best-selling products.', async () => {
    // Mimicking raw order_items returned from the database model
    const mockData = [
      { product_name: 'Package B', quantity: 68 },
      { product_name: 'Package A', quantity: 51 },
      { product_name: 'Ensaymada', quantity: 45 },
      { product_name: 'Cupcake', quantity: 38 },
      { product_name: 'Brownies', quantity: 32 },
      { product_name: 'Pandesal', quantity: 20 },
      { product_name: 'Cookies', quantity: 15 },
    ];

    vi.spyOn(OrderItemsModel, 'getByOrderDateRange').mockResolvedValue(mockData);

    const timeframe = 'Day';
    const result = await TopProductsService.getTopProductsByTimeframe(timeframe);

    expect(OrderItemsModel.getByOrderDateRange).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(5);
    expect(result[0].name).toBe('Package B');
    expect(result[4].name).toBe('Brownies');
  });

  it('It should throw AppError when data is null.', async () => {

    vi.spyOn(OrderItemsModel, 'getByOrderDateRange').mockRejectedValue(new Error('DB Error'));
    const timeframe = 'Month';

    await expect(TopProductsService.getTopProductsByTimeframe(timeframe))
      .rejects
      .toThrow('Failed to fetch top products from database');
  });
});