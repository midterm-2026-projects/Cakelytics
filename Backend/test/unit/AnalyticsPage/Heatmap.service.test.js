import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// INAYOS ANG PATH: Tatlong ../ na ngayon
const heatmapService = require("../../../src/services/AnalyticsPage/Heatmap.service.js");
const analyticsModel = require("../../../src/model/analytics.model.js");

describe("Heatmap Service - getOrderVolumeByTimeframe", () => {
  const selectedWeekStart = "2023-10-16";
  
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("should return heatmap data when model fetch is successful", async () => {
    const mockData = [
      { day: "Monday", hour: 9, orderCount: 12 },
      { day: "Monday", hour: 10, orderCount: 20 },
    ];

    vi.spyOn(analyticsModel, 'getOrderVolumeByTimeframe').mockResolvedValue(mockData);

    const result = await heatmapService.getOrderVolumeByTimeframe(selectedWeekStart);

    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledWith(selectedWeekStart);
    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it("should throw an error when model returns no data", async () => {
    const mockError = new Error("No order volume data found");

    vi.spyOn(analyticsModel, 'getOrderVolumeByTimeframe').mockRejectedValue(mockError);

    await expect(
      heatmapService.getOrderVolumeByTimeframe(selectedWeekStart)
    ).rejects.toThrow("No order volume data found");

    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledWith(selectedWeekStart);
    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledTimes(1);
  });
});