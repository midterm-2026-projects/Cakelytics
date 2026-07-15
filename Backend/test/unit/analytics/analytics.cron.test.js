import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupAnalyticsCron } from '../../../src/cron/analytics.cron.js';

function createFakeScheduler() {
  return {
    schedule: vi.fn(() => ({
      start: vi.fn(),
      stop: vi.fn(),
    })),
  };
}

function createFakeServices({ productForecastImpl, salesForecastImpl } = {}) {
  return {
    actionableRecommendationService: {
      getActionableRecommendations: vi.fn().mockResolvedValue(true),
    },
    productForecastService: {
      getProductTrendsByTimeframe: productForecastImpl ?? vi.fn().mockResolvedValue(true),
    },
    salesForecastService: {
      getSalesTrendsByTimeframe: salesForecastImpl ?? vi.fn().mockResolvedValue(true),
    },
  };
}

describe('analytics.cron.js', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('schedules the job and refreshes all analytics without errors', async () => {
    const fakeScheduler = createFakeScheduler();
    const fakeServices = createFakeServices();

    setupAnalyticsCron(fakeScheduler, fakeServices);

    // Verify the scheduler was called correctly
    expect(fakeScheduler.schedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));

    // Grab the callback that was registered
    const cronCallback = fakeScheduler.schedule.mock.calls[0][1];

    // Run the callback
    await cronCallback();

    expect(fakeServices.actionableRecommendationService.getActionableRecommendations).toHaveBeenCalled();
    expect(fakeServices.productForecastService.getProductTrendsByTimeframe).toHaveBeenCalled();
    expect(fakeServices.salesForecastService.getSalesTrendsByTimeframe).toHaveBeenCalled();

    // Called once per timeframe (7d, 30d, 60d)
    expect(fakeServices.productForecastService.getProductTrendsByTimeframe).toHaveBeenCalledTimes(3);
    expect(fakeServices.salesForecastService.getSalesTrendsByTimeframe).toHaveBeenCalledTimes(3);
  });

  it('does not throw when a service call fails', async () => {
    const fakeScheduler = createFakeScheduler();
    const fakeServices = createFakeServices({
      productForecastImpl: vi.fn().mockRejectedValueOnce(new Error('fail')),
    });

    setupAnalyticsCron(fakeScheduler, fakeServices);

    const cronCallback = fakeScheduler.schedule.mock.calls[0][1];

    // Should resolve thanks to the try/catch in the source code
    await expect(cronCallback()).resolves.toBeUndefined();
  });
});