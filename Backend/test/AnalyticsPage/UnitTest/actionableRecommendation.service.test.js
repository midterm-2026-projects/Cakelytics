import { describe, it, expect, vi, beforeEach } from 'vitest';
import actionableRecommendationService from '../../../src/services/AnalyticsPage/actionableRecommendation.service.js';
import analyticsModel from '../../../src/model/analytics.model.js';

vi.mock('../../../src/model/analytics.model.js', () => ({
  default: { getActionableRecommendations: vi.fn() },
}));

describe('Actionable Recommendation Service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should fetch recommendations derived from the current sales and product forecast results.', async () => {
   
    const mockRecommendations = [
      {
        badge: "RESTOCK",
        title: "I-ready ang Cake Flour at Cocoa Powder",
        desc: "Ayon sa projected sales at product demand forecast, tataas ang benta ng Mocha Dedication Cake. Siguraduhing sapat ang raw ingredients."
      }
    ];
    analyticsModel.getActionableRecommendations.mockResolvedValue(mockRecommendations);

    const result = await actionableRecommendationService.getRecommendations();

    expect(analyticsModel.getActionableRecommendations).toHaveBeenCalled();
    

    expect(result).toEqual(mockRecommendations);
    expect(result[0].desc).toContain('projected sales at product demand forecast');
    expect(result[0].desc).toContain('raw ingredients');
  });
});