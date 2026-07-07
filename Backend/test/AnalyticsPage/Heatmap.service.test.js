import { describe, it, expect, vi, beforeEach } from "vitest";
import heatmapService from "../../src/services/AnalyticsPage/Heatmap.service";
import analyticsModel from "../../src/model/analytics.model";

vi.mock("../../src/model/analytics.model");

describe("Heatmap Service - getOrderVolumeByTimeframe", () => {

  const selectedWeekStart = "2023-10-16";
  
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("should return heatmap data when model fetch is successful", async () => {
    const mockData = [
      { day: "Monday", hour: 9, orderCount: 12 },
      { day: "Monday", hour: 10, orderCount: 20 },
    ];

    analyticsModel.getOrderVolumeByTimeframe.mockResolvedValue(mockData);

    const result = await heatmapService.getOrderVolumeByTimeframe(selectedWeekStart);

    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledWith(selectedWeekStart);
    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });

  it("should throw an error when model returns no data", async () => {
    const mockError = new Error("No order volume data found");

    analyticsModel.getOrderVolumeByTimeframe.mockRejectedValue(mockError);

    await expect(
      heatmapService.getOrderVolumeByTimeframe(selectedWeekStart)
    ).rejects.toThrow("No order volume data found");

    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledWith(selectedWeekStart);
    expect(analyticsModel.getOrderVolumeByTimeframe).toHaveBeenCalledTimes(1);
  });
});