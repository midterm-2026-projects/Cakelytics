import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// INAYOS ANG PATH: Tatlong ../ na ngayon
const ActionableRecommendationService = require('../../../src/services/AnalyticsPage/actionableRecommendation.service.js');
const analyticsModel = require('../../../src/model/analytics.model.js');

describe('ActionableRecommendation Service', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('should return actionable recommendations when fetch is successful', async () => {
    const mockData = [
      { recommendation: "Increase stock for Package B", priority: "High" }
    ];

    vi.spyOn(analyticsModel, 'getActionableRecommendations').mockResolvedValue(mockData);

    const result = await ActionableRecommendationService.getActionableRecommendations();

    expect(analyticsModel.getActionableRecommendations).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockData);
  });
});