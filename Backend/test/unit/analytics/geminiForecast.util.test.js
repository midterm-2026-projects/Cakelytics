import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Gemini Forecast Utility', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it('should successfully parse and return JSON from a mocked Gemini response', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'fake-test-api-key');
    
    const { callGeminiJSON } = await import('../../../src/utils/analytics/geminiForecast.util.js');

    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: '{"status": "success", "data": "mocked forecast"}' }]
          }
        }
      ]
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGeminiResponse
    });

    const result = await callGeminiJSON({ systemPrompt: 'System instruction', userPrompt: 'User data' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ status: 'success', data: 'mocked forecast' });
  });

  it('should throw an error if the GEMINI_API_KEY is missing', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const { callGeminiJSON } = await import('../../../src/utils/analytics/geminiForecast.util.js');

    await expect(callGeminiJSON({ systemPrompt: 'test', userPrompt: 'test' }))
      .rejects
      .toThrow('GEMINI_API_KEY is not set in the environment');
      
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should throw an error if the mocked fetch call fails (e.g., 500 Server Error)', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'fake-test-api-key');
    const { callGeminiJSON } = await import('../../../src/utils/analytics/geminiForecast.util.js');

    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    await expect(callGeminiJSON({ systemPrompt: 'test', userPrompt: 'test' }))
      .rejects
      .toThrow('Gemini API error 500: Internal Server Error');
  });

  it('should clean up and handle markdown-fenced JSON strings from the AI', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'fake-test-api-key');
    const { callGeminiJSON } = await import('../../../src/utils/analytics/geminiForecast.util.js');

    const fencedText = '```json\n{"status": "success", "data": "fenced forecast"}\n```';

    const mockGeminiResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: fencedText }]
          }
        }
      ]
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockGeminiResponse
    });

    const result = await callGeminiJSON({ systemPrompt: 'test', userPrompt: 'test' });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ status: 'success', data: 'fenced forecast' });
  });
});