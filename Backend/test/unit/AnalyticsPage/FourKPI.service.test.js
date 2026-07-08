import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 1. WALA NANG vi.mock(...) SA TAAS! BURA NA YON.

// 2. PURE COMMONJS REQUIRE (Tiyak na iisang object na lang ito sa memory)
const { FourKpiModel } = require("../../../src/model/analytics/fourKPI.model.js");
const { FourKpiService } = require("../../../src/services/AnalyticsPage/FourKPI.service.js");

describe("FourKPI.services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Importante ito kapag gumagamit ng vi.spyOn para malinis per test
    vi.restoreAllMocks(); 
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

    // 3. GAMITIN ANG vi.spyOn() PARA I-HIJACK ANG FUNCTION
    vi.spyOn(FourKpiModel, "getKpiByTimeframe").mockResolvedValue(mockKpiData);

    const result = await FourKpiService.getKpiByTimeframe("week");

    expect(result).toEqual(mockKpiData);
  });

  it("should call the model with the correct timeframe", async () => {
    // 4. GAMITIN ULIT ANG vi.spyOn() DITO
    const spy = vi.spyOn(FourKpiModel, "getKpiByTimeframe").mockResolvedValue({});

    await FourKpiService.getKpiByTimeframe("month");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("month");
  });
});