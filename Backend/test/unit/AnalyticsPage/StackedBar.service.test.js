import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { StackedBarModel } = require("../../../src/model/analytics/stackedBar.model.js");
const { StackedBarServices } = require("../../../src/services/AnalyticsPage/StackedBar.service.js");

describe("StackedBar.services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks(); 
  });

  it("should return trend data when model fetch is successful", async () => {
    const mockTrendData = {
      orders: [
        { grand_total: 12000, status: 'Completed', created_at: '2026-10-01' }
      ],
      ingredients: [
        { name: 'Flour', stock_quantity: 10, cost_per_unit: 50, created_at: '2026-10-01' }
      ]
    };

    vi.spyOn(StackedBarModel, "getStackedBarByTimeframe").mockResolvedValue(mockTrendData);

    const result = await StackedBarServices.getStackedBarByTimeframe("Last 7 Days");

    expect(result).toEqual(mockTrendData);
  });

  it("should call the model with the correct timeframe", async () => {
    const spy = vi.spyOn(StackedBarModel, "getStackedBarByTimeframe").mockResolvedValue({
      orders: [],
      ingredients: []
    });

    await StackedBarServices.getStackedBarByTimeframe("This Month");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("This Month");
  });
});