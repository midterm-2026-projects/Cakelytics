import { describe, it, expect, vi, beforeEach } from "vitest";
import StackedBarServices from "../../src/services/AnalyticsPage/StackedBar.service";
import analyticsModel from "../../src/model/analytics.model";


vi.mock("../../src/model/analytics.model", () => ({
  default: {
    getStackedBarByTimeframe: vi.fn(),
  },
}));



describe("StackedBar.services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should returns trend data when model fetch is successful", async () => {
    const mockTrendData = [
      { period: "Mon", sales: 12000, expenses: 7000 },
      { period: "Tue", sales: 15000, expenses: 8200 },
      { period: "Wed", sales: 9800, expenses: 6100 },
    ];

    analyticsModel.getStackedBarByTimeframe.mockResolvedValue(mockTrendData);

    const result = await StackedBarServices.getStackedBarByTimeframe("Last 7 Days");

    expect(result).toEqual(mockTrendData);
  });

  it("should call the model with the correct timeframe", async () => {
    analyticsModel.getStackedBarByTimeframe.mockResolvedValue([]);

    await StackedBarServices.getStackedBarByTimeframe("This Month");

    expect(analyticsModel.getStackedBarByTimeframe).toHaveBeenCalledTimes(1);
    expect(analyticsModel.getStackedBarByTimeframe).toHaveBeenCalledWith("This Month");
  });
});