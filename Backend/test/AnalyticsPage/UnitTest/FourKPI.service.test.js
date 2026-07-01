import { describe, it, expect, vi, beforeEach } from "vitest";
import FourKpiService from "../../../src/services/AnalyticsPage/FourKPI.service.js";
import analyticsModel from "../../../src/model/analytics.model.js";


vi.mock("../../../src/model/analytics.model", () => ({
  default: {
    getKpiByTimeframe: vi.fn(),
  },
}));

describe("FourKPI.services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return KPI data when model fetch is successful", async () => {
    const mockKpiData = {
      sales: 158000,
      sDelta: 6.2,
      expenses: 88500,
      eDelta: 2.1,
      profit: 69500,
      pDelta: 11.4,
      margin: 44.0,
      mDelta: 1.4,
    };

    analyticsModel.getKpiByTimeframe.mockResolvedValue(mockKpiData);

    const result = await FourKpiService.getKpiByTimeframe("week");

    expect(result).toEqual(mockKpiData);
  });

  it("should call the model with the correct timeframe", async () => {
    analyticsModel.getKpiByTimeframe.mockResolvedValue({});

    await FourKpiService.getKpiByTimeframe("month");

    expect(analyticsModel.getKpiByTimeframe).toHaveBeenCalledTimes(1);
    expect(analyticsModel.getKpiByTimeframe).toHaveBeenCalledWith("month");
  });
});