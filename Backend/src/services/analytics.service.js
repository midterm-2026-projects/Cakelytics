const OrdersModel = require("../model/orders.model.js");
const OrderItemsModel = require("../model/orderItems.model.js");
const { InventoryLogModel: InventoryLogsModel } = require("../model/inventoryLog.model.js");
const WasteLogsModel = require("../model/wasteLogs.model.js");
const AnalyticsCacheModel = require("../model/analyticsCache.model.js");

const { callGeminiJSON } = require("../utils/analytics/geminiForecast.util.js");
const { getLookbackDateRange } = require("../utils/analytics/ForecastTimeframe.utils.js");
const { getDateRange } = require("../utils/analytics/PerformancetTimeframeHelper.utils.js");

const TIMEFRAME_DAYS = { "7d": 7, "30d": 30, "60d": 60 };

function buildDateSequenceSafe(startDate, endDate) {
  const dates = [];
  let cur = new Date(startDate);
  cur.setHours(0, 0, 0, 0);
  let end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (cur <= end) {
    const year = cur.getFullYear();
    const month = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// ==========================================
// 1. ACTIONABLE RECOMMENDATIONS SERVICE
// ==========================================
const AR_CACHE_KEY = "actionable_recommendations";
const AR_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const AR_VALID_TYPES = ["success", "warning", "danger", "info", "neutral"];
const AR_TREND_LOOKBACK_DAYS = 60; 
const AR_COMPARISON_WINDOW_DAYS = 30; 

async function getRecentSalesTrend() {
  const { startDate, endDate } = getLookbackDateRange(AR_TREND_LOOKBACK_DAYS);

  const orders = await OrdersModel.getByDateRange(startDate, endDate, {
    columns: "grand_total, created_at",
    excludeCancelled: true,
    ascending: true,
  });

  const totalsByDate = {};
  for (const order of orders) {
    const day = order.created_at.slice(0, 10);
    totalsByDate[day] = (totalsByDate[day] || 0) + Number(order.grand_total || 0);
  }

  return Object.keys(totalsByDate)
    .sort()
    .map((date) => ({ date, totalSales: totalsByDate[date] }));
}

async function getProductGrowthAndRisk() {
  const { startDate: recentStart, endDate: recentEnd } = getLookbackDateRange(AR_COMPARISON_WINDOW_DAYS);
  const { startDate: priorStart } = getLookbackDateRange(AR_COMPARISON_WINDOW_DAYS * 2);
  const priorEnd = recentStart;

  const columns = "product_name, quantity, orders!inner(created_at, status)";

  const [recentItems, priorItems] = await Promise.all([
    OrderItemsModel.getByOrderDateRange(recentStart, recentEnd, { columns }),
    OrderItemsModel.getByOrderDateRange(priorStart, priorEnd, { columns }),
  ]);

  const sumByProduct = (items) => {
    const totals = {};
    for (const item of items) {
      totals[item.product_name] = (totals[item.product_name] || 0) + Number(item.quantity || 0);
    }
    return totals;
  };

  const recentTotals = sumByProduct(recentItems);
  const priorTotals = sumByProduct(priorItems);
  const productNames = new Set([...Object.keys(recentTotals), ...Object.keys(priorTotals)]);

  const changes = [...productNames].map((name) => {
    const recentQty = recentTotals[name] || 0;
    const priorQty = priorTotals[name] || 0;
    const diff = recentQty - priorQty;
    const pct = priorQty === 0 ? (recentQty > 0 ? 100 : 0) : Math.round((diff / priorQty) * 100);
    return { name, recentQty, priorQty, diff, pct };
  });

  const topGrowthProducts = changes
    .filter((c) => c.diff > 0)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 5);

  const topRiskProducts = changes
    .filter((c) => c.diff < 0)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);

  return { topGrowthProducts, topRiskProducts };
}

async function getRecommendationContext() {
  const { startDate: wasteStart, endDate: wasteEnd } = getLookbackDateRange(AR_TREND_LOOKBACK_DAYS);

  const [recentSalesTrend, growthAndRisk, inventoryLogs, recentWaste] = await Promise.all([
    getRecentSalesTrend(),
    getProductGrowthAndRisk(),
    InventoryLogsModel.getByDateRange(wasteStart, wasteEnd),
    WasteLogsModel.getRecent(wasteStart, wasteEnd),
  ]);

  const inventorySummary = (inventoryLogs || []).reduce((acc, log) => {
    if (!acc[log.item_name]) acc[log.item_name] = { in_restock: 0, out_used: 0, waste: 0 };
    
    if (log.transaction_type === 'IN') {
      acc[log.item_name].in_restock += Number(log.quantity);
    } else if (log.transaction_type === 'OUT') {
      if (log.action === 'Waste') {
        acc[log.item_name].waste += Number(log.quantity);
      } else {
        acc[log.item_name].out_used += Number(log.quantity);
      }
    }
    return acc;
  }, {});

  return {
    recentSalesTrend,
    topGrowthProducts: growthAndRisk.topGrowthProducts,
    topRiskProducts: growthAndRisk.topRiskProducts,
    inventoryActivitySummary: inventorySummary, 
    recentWaste,
  };
}

function buildActionablePrompt(context) {
  const systemPrompt = `You are the business advisor engine for Cakelytics, a bakery/cake shop analytics system.
You are given 60 days of historical data: recent sales trends, product growth/risk signals, inventory activity, and waste logs.
Your job is to analyze this data and project actionable advice covering short-term (7 days) up to long-term (30 to 60 days) scenarios.

Write short, practical, ACTIONABLE recommendations for the shop owner IN DIRECT, CONVERSATIONAL TAGALOG (Filipino). Wag masyadong madaming ebas (direct to the point, no fluff).

CRITICAL RULE:
You MUST explicitly mention the timeframe you are basing the recommendation on inside the description to give the user context. 
Example phrasing: "Ayon sa 7-day forecast...", "Base sa 60-day trend natin...", "Sa susunod na 30 araw...".

Respond with ONLY valid JSON (no markdown, no commentary) in exactly this shape:
{
  "recommendations": [
    {
      "badge": "SHORT ALL-CAPS TAG (e.g. DISKARTE, PROMO, TANDAAN, BABALA)",
      "title": "Short actionable title in Tagalog",
      "desc": "1-3 sentence explanation/action plan in direct Tagalog, explicitly mentioning the timeframe (7-day, 30-day, or 60-day).",
      "type": "success" | "warning" | "danger" | "info" | "neutral"
    }
  ]
}

Rules:
- Use "success" for growth, "warning" for slowing products, "danger" for urgent stock/waste issues, "info" for promo ideas, "neutral" for general reminders.
- Base every recommendation strictly on the data given.
- Return 3 to 5 recommendations, ordered by business impact (most urgent first).`;

  const userPrompt = `Business context (JSON): ${JSON.stringify(context)}`;

  return { systemPrompt, userPrompt };
}

function normalizeActionablePayload(aiResult) {
  const list = Array.isArray(aiResult?.recommendations) ? aiResult.recommendations : [];
  const recommendations = list
    .filter((r) => r && r.title && r.desc)
    .map((r) => ({
      badge: String(r.badge ?? "TANDAAN").toUpperCase(),
      title: String(r.title),
      desc: String(r.desc),
      type: AR_VALID_TYPES.includes(r.type) ? r.type : "neutral",
    }));

  return { recommendations };
}

const ActionableRecommendationService = {
  async getActionableRecommendations(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = await AnalyticsCacheModel.getByKey(AR_CACHE_KEY);
      if (cached && cached.payload) {
        return cached.payload;
      }
      return { recommendations: [] };
    }

    try {
      const context = await getRecommendationContext();
      const { systemPrompt, userPrompt } = buildActionablePrompt(context);
      const aiResult = await callGeminiJSON({ systemPrompt, userPrompt });
      const payload = normalizeActionablePayload(aiResult);

      await AnalyticsCacheModel.upsert(AR_CACHE_KEY, payload, AR_CACHE_TTL_MS);
      return payload;
    } catch (err) {
      console.error("[ActionableRecommendationService] Gemini recommendation failed:", err.message);
      return { recommendations: [] };   
    }
  },
};

// ==========================================
// 2. FOUR KPI SERVICE
// ==========================================
function calculateMetrics(orders, inventoryLogs) {
  const totalSales = (orders || []).reduce((sum, order) => sum + Number(order.grand_total || 0), 0);
  const totalExpenses = (inventoryLogs || []).reduce((sum, log) => {
    if (log.transaction_type === 'IN') return sum + Number(log.cost || 0);
    return sum;
  }, 0);

  const grossProfit = totalSales - totalExpenses;
  const profitMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;

  return { totalSales, totalExpenses, grossProfit, profitMargin };
}

function calculateDelta(current, prior) {
  if (prior === 0) return current > 0 ? 100 : 0; 
  return ((current - prior) / Math.abs(prior)) * 100;
}

function formatDateForDB(dateObj) {
  return new Date(dateObj).toISOString(); 
}

async function getKpiByTimeframe(timeframe) {
  try {
    const { startDate, endDate } = getDateRange(timeframe);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = end.getTime() - start.getTime(); 
    
    const priorEndDate = new Date(start.getTime() - 1); 
    const priorStartDate = new Date(start.getTime() - duration);

    const priorStartStr = formatDateForDB(priorStartDate);
    const priorEndStr = formatDateForDB(priorEndDate);

    const [currentOrders, currentInventoryLogs, priorOrders, priorInventoryLogs] = await Promise.all([
      OrdersModel.getByDateRange(startDate, endDate, { columns: "grand_total, status, created_at", excludeCancelled: true }),
      InventoryLogsModel.getByDateRange(startDate, endDate),
      OrdersModel.getByDateRange(priorStartStr, priorEndStr, { columns: "grand_total, status, created_at", excludeCancelled: true }),
      InventoryLogsModel.getByDateRange(priorStartStr, priorEndStr)
    ]);

    const currentMetrics = calculateMetrics(currentOrders, currentInventoryLogs);
    const priorMetrics = calculateMetrics(priorOrders, priorInventoryLogs);

    return {
      totalSales: parseFloat(currentMetrics.totalSales.toFixed(2)),
      sDelta: parseFloat(calculateDelta(currentMetrics.totalSales, priorMetrics.totalSales).toFixed(2)),
      
      totalExpenses: parseFloat(currentMetrics.totalExpenses.toFixed(2)),
      eDelta: parseFloat(calculateDelta(currentMetrics.totalExpenses, priorMetrics.totalExpenses).toFixed(2)),
      
      grossProfit: parseFloat(currentMetrics.grossProfit.toFixed(2)),
      pDelta: parseFloat(calculateDelta(currentMetrics.grossProfit, priorMetrics.grossProfit).toFixed(2)),
      
      profitMargin: parseFloat(currentMetrics.profitMargin.toFixed(2)),
      mDelta: parseFloat((currentMetrics.profitMargin - priorMetrics.profitMargin).toFixed(2))
    };

  } catch (error) {
    console.error("🔥 BACKEND CRASH SA FOUR KPI:", error.message || error);
    throw error;
  }
}

const FourKpiService = { getKpiByTimeframe };

const PF_CACHE_TTL_MS = 6 * 60 * 60 * 1000; 
const PF_TIMEFRAME_LABELS = { "7d": "Next 7 Days", "30d": "Next 30 Days", "60d": "Next 60 Days" };

function buildProductCacheKey(timeframe) {
  return `product_forecast:${timeframe}`;
}

async function getRawProductSalesHistory(days) {
  const { startDate, endDate } = getLookbackDateRange(days);

  const rows = await OrderItemsModel.getByOrderDateRange(startDate, endDate, {
    columns: `
      quantity,
      products ( name, category ),
      orders!inner ( created_at, status )
    `,
    excludeCancelled: true,
  });

  const dateSequence = buildDateSequenceSafe(startDate, endDate);
  const byProduct = {}; 

  for (const row of rows) {
    const name = row.products?.name || "Unknown Product";
    const category = row.products?.category || "Uncategorized";
    const key = `${name}|||${category}`;
    const day = row.orders?.created_at?.slice(0, 10);

    if (!byProduct[key]) {
      byProduct[key] = { productName: name, category, qtyByDate: {} };
    }
    byProduct[key].qtyByDate[day] = (byProduct[key].qtyByDate[day] || 0) + Number(row.quantity || 0);
  }

  return Object.values(byProduct).map((p) => ({
    productName: p.productName,
    category: p.category,
    dailyQty: dateSequence.map((d) => p.qtyByDate[d] || 0),
  }));
}

function buildProductPrompt(timeframe, productSalesHistory) {
  const days = TIMEFRAME_DAYS[timeframe] || 30;

  const systemPrompt = `You are the product-trend forecasting engine for a bakery/cake shop analytics system.
You will be given per-product recent sales quantities (units sold), grouped by day, from the "order_items" table.
Your job: identify which products are trending UP (growth) and which are trending DOWN (at risk) over the next ${days} days.

Respond with ONLY valid JSON (no markdown, no commentary) in exactly this shape:
{
  "growth": [
    { "name": "Product Name", "pct": number, "diff": number, "forecast": number }
  ],
  "risk": [
    { "name": "Product Name", "pct": number, "diff": number, "forecast": number }
  ]
}

Rules:
- "pct" is the projected % change vs. the current period (positive for growth, negative for risk).
- "diff" is the projected change in units (positive for growth, negative for risk).
- "forecast" is the projected total units sold over the next ${days} days.
- CRITICAL: You MUST return the top products in "growth" and "risk". Even if the sales volume is low or there are many days with 0 sales, calculate the mathematical differences and rank the top movers. DO NOT return empty arrays.
- Return up to 4 products in each array.`;

  const userPrompt = `Timeframe requested: ${timeframe} (forecast horizon: ${days} days)
Per-product recent sales history: ${JSON.stringify(productSalesHistory)}`;

  return { systemPrompt, userPrompt };
}

function normalizeList(list) {
  return (Array.isArray(list) ? list : []).map((item) => ({
    name: String(item.name ?? ""),
    pct: Number(item.pct ?? 0),
    diff: Number(item.diff ?? 0),
    forecast: Number(item.forecast ?? 0),
  }));
}

function normalizeProductPayload(aiResult, timeframe) {
  return {
    label: PF_TIMEFRAME_LABELS[timeframe] || PF_TIMEFRAME_LABELS["30d"],
    growth: normalizeList(aiResult?.growth),
    risk: normalizeList(aiResult?.risk),
  };
}

function emptyProductPayload(timeframe) {
  return { label: PF_TIMEFRAME_LABELS[timeframe] || PF_TIMEFRAME_LABELS["30d"], growth: [], risk: [] };
}

const ProductForecastService = {
  async getProductTrendsByTimeframe(timeframe = "30d", forceRefresh = false) {
    const cacheKey = buildProductCacheKey(timeframe);

    if (!forceRefresh) {
      const cached = await AnalyticsCacheModel.getByKey(cacheKey);
      if (cached && cached.payload) {
        return cached.payload;
      }
      return emptyProductPayload(timeframe);
    }

    try {
      const days = TIMEFRAME_DAYS[timeframe] || 30;
      const productSalesHistory = await getRawProductSalesHistory(days);

      const { systemPrompt, userPrompt } = buildProductPrompt(timeframe, productSalesHistory);
      const aiResult = await callGeminiJSON({ systemPrompt, userPrompt });
      const payload = normalizeProductPayload(aiResult, timeframe);

      await AnalyticsCacheModel.upsert(cacheKey, payload, PF_CACHE_TTL_MS);
      return payload;
    } catch (err) {
      console.error("[ProductForecastService] Gemini forecast failed:", err.message);
      return emptyProductPayload(timeframe);
    }
  },
};

const SF_CACHE_TTL_MS = 4 * 60 * 60 * 1000;

function buildSalesCacheKey(timeframe) {
  return `sales_forecast:${timeframe}`;
}

async function getRawSalesHistory(days) {
  const { startDate, endDate } = getLookbackDateRange(days);

  const orders = await OrdersModel.getByDateRange(startDate, endDate, {
    columns: "grand_total, created_at",
    excludeCancelled: true,
    ascending: true,
  });

  const totalsByDate = {};
  for (const order of orders) {
    const day = order.created_at.slice(0, 10);
    totalsByDate[day] = (totalsByDate[day] || 0) + Number(order.grand_total || 0);
  }

  const todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

  const allDates = buildDateSequenceSafe(startDate, endDate);
  
  return allDates.map((date) => {
    let sales = totalsByDate[date];
    
    if (date === todayStr && !sales) {
      return { date, totalSales: null, isToday: true };
    }
    
    return { 
      date, 
      totalSales: sales || 0, 
      isToday: date === todayStr 
    };
  });
}

function buildSalesPrompt(timeframe, historicalSales) {
  const days = TIMEFRAME_DAYS[timeframe] || 30;

  const systemPrompt = `You are the sales forecasting engine for a bakery/cake shop point-of-sale analytics system.
You will be given real daily sales totals (in PHP) from the "orders" table.
Your job: analyze the trend/seasonality and produce a forecast for the upcoming period.

Respond with ONLY valid JSON (no markdown, no commentary) in exactly this shape:
{
  "chartData": [
    {
      "label": "Jan 1",
      "isToday": false,
      "actualSales": number | null,
      "forecastSales": number | null
    }
  ]
}

Rules:
- Include all provided historical days first.
- Exactly one entry must have "isToday": true.
- CRITICAL: If 'totalSales' is null in the historical data (because the day just started), you MUST set 'actualSales' to null in your output so the chart doesn't falsely drop.
- Follow the historical days with ${days} future days where actualSales is null and forecastSales is your prediction.
- CRITICAL (line continuity): the chart draws "actualSales" as a solid line and "forecastSales" as a dashed line. These are two separate series, so if the "isToday" entry only has one of the two fields set, the solid and dashed lines will visually disconnect at the boundary. To prevent this, on the "isToday" entry set BOTH fields to the same value: if 'totalSales' is known for today, set actualSales = forecastSales = that value; if 'totalSales' is null (day just started, no sales yet), set actualSales = forecastSales = your predicted total for today. Every other entry keeps only one of the two fields non-null as usual.
- "label" must be formatted like "Jan 1", "Feb 14", etc.`;

  const userPrompt = `Timeframe requested: ${timeframe} (${days} days ahead)
Historical daily sales data: ${JSON.stringify(historicalSales)}`;

  return { systemPrompt, userPrompt };
}

function normalizeSalesPayload(aiResult) {
  const chartData = Array.isArray(aiResult?.chartData) ? aiResult.chartData : [];

  const todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const realTodayLabel = todayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  
  let foundToday = false;

  return {
    chartData: chartData.map((d) => {
      const label = String(d.label ?? "");
      
      // 2. WAG MAGTIWALA SA AI! I-set ang isToday base sa totoong label
      const isToday = (label === realTodayLabel);
      
      if (isToday) foundToday = true;

      // Kung hindi pa nahahanap ang Today at hindi ito ang Today, past day ito
      const isPastDay = !foundToday && !isToday;

      return {
        label: label,
        isToday: isToday, 
        actualSales: d.actualSales === null || d.actualSales === undefined ? null : Number(d.actualSales),
        // 3. I-force null ang forecast sa past days para iwas overlap
        forecastSales: isPastDay ? null : (d.forecastSales === null || d.forecastSales === undefined ? null : Number(d.forecastSales)),
      };
    }),
  };
}

const SalesForecastService = {
  async getSalesTrendsByTimeframe(timeframe = "30d", forceRefresh = false) {
    const cacheKey = buildSalesCacheKey(timeframe);

    if (!forceRefresh) {
      const cached = await AnalyticsCacheModel.getByKey(cacheKey);
      if (cached && cached.payload) {
        return { chartData: cached.payload.chartData };
      }
      return { chartData: [] };
    }

    try {
      const days = TIMEFRAME_DAYS[timeframe] || 30;
      const historicalSales = await getRawSalesHistory(days);

      const { systemPrompt, userPrompt } = buildSalesPrompt(timeframe, historicalSales);
      const aiResult = await callGeminiJSON({ systemPrompt, userPrompt });
      const payload = normalizeSalesPayload(aiResult);

      await AnalyticsCacheModel.upsert(cacheKey, payload, SF_CACHE_TTL_MS);
      
      // Binalik natin yung missing return para mabasa ng seed script mo
      return payload; 
    } catch (err) {
      console.error("[SalesForecastService] Gemini forecast failed:", err.message);
      return { chartData: [] };
    }
  },
};

async function getStackedBarByTimeframe(timeframe) {
  try {
    const { startDate, endDate } = getDateRange(timeframe);

    const [orders, inventoryLogs] = await Promise.all([
      OrdersModel.getByDateRange(startDate, endDate, {
        columns: "grand_total, status, updated_at",
        excludeCancelled: true,
        ascending: true,
      }),
      InventoryLogsModel.getByDateRange(startDate, endDate, { ascending: true })
    ]);

    const groupedData = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (timeframe === 'Today' || timeframe === 'Yesterday') {
      const hours = [6, 8, 10, 12, 14, 16, 18, 20];
      hours.forEach(h => {
        const label = h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
        groupedData[label] = { label, Sales: 0, Expenses: 0, sortKey: h };
      });
    } else if (timeframe === 'This Year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthLimit = end.getMonth(); 
      for (let i = 0; i <= currentMonthLimit; i++) {
        groupedData[months[i]] = { label: months[i], Sales: 0, Expenses: 0, sortKey: i };
      }
    } else if (timeframe === 'This Month') {
      const year = start.getFullYear();
      const month = start.getMonth();
      const currentDayLimit = end.getDate(); 
      
      for (let i = 1; i <= currentDayLimit; i++) {
        const d = new Date(year, month, i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        groupedData[label] = { label, Sales: 0, Expenses: 0, sortKey: d.getTime() };
      }
    } else if (timeframe === 'Last Month') {
      const year = start.getFullYear();
      const month = start.getMonth();
      const daysInMonth = end.getDate(); 
      
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        groupedData[label] = { label, Sales: 0, Expenses: 0, sortKey: d.getTime() };
      }
    } else if (timeframe === 'Last 7 Days') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        const day = d.toLocaleDateString('en-US', { weekday: 'short' });
        const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const label = `${day} (${date})`;
        groupedData[label] = { label, Sales: 0, Expenses: 0, sortKey: d.getTime() };
      }
    } else {
      let curr = new Date(start);
      curr.setHours(0,0,0,0);
      while (curr <= end) {
        const label = curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        groupedData[label] = { label, Sales: 0, Expenses: 0, sortKey: curr.getTime() };
        curr.setDate(curr.getDate() + 1);
      }
    }

    const getLabelForData = (isoString, period) => {
      const d = new Date(isoString);
      if (period === 'Today' || period === 'Yesterday') {
        let h = d.getHours();
        if (h < 6) h = 6; 
        if (h > 20) h = 20; 
        if (h % 2 !== 0) h -= 1; 
        return h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
      } else if (period === 'Last 7 Days') {
        const day = d.toLocaleDateString('en-US', { weekday: 'short' });
        const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${day} (${date})`;
      } else if (period === 'This Year') {
        return d.toLocaleDateString('en-US', { month: 'short' });
      } else {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    const processItem = (item, type) => {
      const dateString = item.updated_at || item.created_at;
      if (!dateString) return;
      
      const label = getLabelForData(dateString, timeframe);

      if (groupedData[label]) {
        if (type === 'sales') {
          groupedData[label].Sales += Number(item.grand_total || 0);
        } else if (type === 'expenses') {
          if (item.transaction_type === 'IN') {
            groupedData[label].Expenses += Number(item.cost || 0);
          }
        }
      }
    };

    (orders || []).forEach(o => processItem(o, 'sales'));
    (inventoryLogs || []).forEach(log => processItem(log, 'expenses'));

    const chartData = Object.values(groupedData).sort((a, b) => a.sortKey - b.sortKey);

    return chartData.map(item => {
      const sales = parseFloat(item.Sales.toFixed(2));
      const expenses = parseFloat(item.Expenses.toFixed(2));
      const profit = parseFloat((sales - expenses).toFixed(2));
      
      return {
        label: item.label,
        Sales: sales,
        Expenses: expenses,
        Profit: profit 
      };
    });

  } catch (error) {
    throw error;
  }
}

const StackedBarServices = { getStackedBarByTimeframe };

async function fetchRawTopProductsByTimeframe(timeframe) {
  const { startDate, endDate } = getDateRange(timeframe);

  let items;
  try {
    items = await OrderItemsModel.getByOrderDateRange(startDate, endDate, {
      columns: "product_name, quantity, orders!inner(created_at, status)",
      excludeCancelled: true,
    });
  } catch (error) {
    console.error("Supabase Error sa Top Products:", error);
    throw new Error("Failed to fetch top products from database");
  }

  const productMap = {};
  items.forEach((item) => {
    if (!productMap[item.product_name]) {
      productMap[item.product_name] = 0;
    }
    productMap[item.product_name] += item.quantity;
  });

  return Object.keys(productMap)
    .map((name) => ({ name, sold: productMap[name] }))
    .sort((a, b) => b.sold - a.sold);
}

const TopProductsService = {
  async getTopProductsByTimeframe(timeframe) {
    const result = await fetchRawTopProductsByTimeframe(timeframe);
    if (!result) {
      throw new Error("AppError");
    }
    return result.slice(0, 5);
  },
};

module.exports = {
  ActionableRecommendationService,
  FourKpiService,
  ProductForecastService,
  SalesForecastService,
  StackedBarServices,
  TopProductsService
};
