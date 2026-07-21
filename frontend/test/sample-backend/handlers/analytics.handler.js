import { http, HttpResponse } from "msw";

export const analyticsHandlers = [
  // 🔥 FIX: Pinalitan ng :timeframe ang lahat
  http.get("/api/analytics/four-kpi/:timeframe", ({ request }) => {
    return HttpResponse.json({
      data: {
        totalSales: 15000,
        totalExpenses: 6000,
        grossProfit: 9000,
        profitMargin: 60,
      }
    });
  }),

  http.get("/api/analytics/sales-forecast/:timeframe", ({ request }) => {
    return HttpResponse.json({
      data: {
        chartData: [
          { date: "Jul 8", label: "Jul 8", name: "Jul 8", actualSales: 1200, actual: 1200, forecastSales: null, forecast: 0 },
          { date: "Jul 9", label: "Jul 9", name: "Jul 9", actualSales: 1500, actual: 1500, forecastSales: 1500, forecast: 1500 },
          { date: "Jul 10", label: "Jul 10", name: "Jul 10", actualSales: null, actual: 0, forecastSales: 1600, forecast: 1600 },
        ]
      }
    });
  }),

  http.get("/api/analytics/product-forecast/:timeframe", ({ request }) => {
    return HttpResponse.json({
      data: {
        label: "Next 30 Days",
        growth: [{ name: "Chocolate Cake", pct: 25, diff: 10, forecast: 50 }],
        risk: [{ name: "Vanilla Cupcake", pct: -15, diff: -5, forecast: 20 }],
      }
    });
  }),

  http.get("/api/analytics/stacked-bar/:timeframe", ({ request }) => {
    return HttpResponse.json({
      data: [
        { label: "Mon", Sales: 5000, Expenses: 2000, Profit: 3000 },
        { label: "Tue", Sales: 4500, Expenses: 1800, Profit: 2700 },
      ]
    });
  }),

  http.get("/api/analytics/top-products/:timeframe", ({ request }) => {
    return HttpResponse.json({
      data: [
        { id: 1, name: "Choco Cake", productName: "Choco Cake", product_name: "Choco Cake", title: "Choco Cake", sold: 120, quantity: 120, totalQuantity: 120, sales: 120, totalSales: 120 },
        { id: 2, name: "Red Velvet", productName: "Red Velvet", product_name: "Red Velvet", title: "Red Velvet", sold: 95, quantity: 95, totalQuantity: 95, sales: 95, totalSales: 95 },
      ]
    });
  }),

  http.get("/api/analytics/actionable-recommendations", () => {
    return HttpResponse.json({
      data: {
        recommendations: [
          {
            badge: "DISKARTE",
            title: "I-promote ang Choco Cake",
            desc: "Tumataas ang benta ng Choco Cake ngayong linggo, gawan mo ng bundle promo.",
            type: "success",
          },
        ]
      }
    });
  }),
];