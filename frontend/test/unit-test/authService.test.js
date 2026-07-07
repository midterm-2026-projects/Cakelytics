import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, logout } from '../../src/services/authService';
import { setToken, clearToken } from '../../src/services/api';

vi.mock('../../src/services/api', () => ({
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

describe('authService (Frontend)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Mock Mode (VITE_USE_MOCK_API = true)', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_USE_MOCK_API', 'true');
    });

    it('should resolve with mock admin data and save token when credentials match db.js seeds', async () => {
      const result = await login('admin@cakelytics.com', '1234');

      expect(result).toHaveProperty('token');
      expect(result.token).toBe('mock-jwt-token-12345');
      expect(result.admin.email).toBe('admin@cakelytics.com');
      expect(result.admin.name).toBe('Christine De Padua');
      expect(setToken).toHaveBeenCalledWith('mock-jwt-token-12345');
    });

    it('should reject with an error when wrong credentials are provided in mock mode', async () => {
      await expect(login('admin@cakelytics.com', 'wrong-pass')).rejects.toThrow('Invalid email or password');
      expect(setToken).not.toHaveBeenCalled();
    });

    it('should clear token and resolve successfully during mock logout', async () => {
      const result = await logout('some-mock-token');

      expect(result.message).toBe('Logged out successfully');
      expect(clearToken).toHaveBeenCalled();
    });
  });


  describe('Real API Mode (VITE_USE_MOCK_API = false)', () => {
    const fakeBaseUrl = 'http://localhost:3000/api';
    let fetchMock;

    beforeEach(() => {
      vi.stubEnv('VITE_USE_MOCK_API', 'false');
      vi.stubEnv('VITE_API_BASE_URL', fakeBaseUrl);
      
      fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
    });

    it('should call fetch, set token, and return data when network login is successful', async () => {
      const mockBackendPayload = {
        token: 'real-jwt-from-supabase-999',
        admin: { id: 'supabase-id', name: 'Christine De Padua', email: 'admin@cakelytics.com' }
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockBackendPayload }),
      });

      const result = await login('admin@cakelytics.com', '1234');

      expect(fetchMock).toHaveBeenCalledWith(`${fakeBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@cakelytics.com', password: '1234' }),
      });
      expect(setToken).toHaveBeenCalledWith('real-jwt-from-supabase-999');
      expect(result).toEqual(mockBackendPayload);
    });

    it('should throw an error message returned by backend API when ok is false', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Login failed' }),
      });

      await expect(login('admin@cakelytics.com', '1234')).rejects.toThrow('Login failed');
      expect(setToken).not.toHaveBeenCalled();
    });

    it('should fire live fetch to logout endpoint and wipe local token upon logging out', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await logout('user-token-abc');

      expect(fetchMock).toHaveBeenCalledWith(`${fakeBaseUrl}/logout`, {
        method: 'POST',
        headers: { Authorization: 'Bearer user-token-abc' },
      });
      expect(clearToken).toHaveBeenCalled();
    });
  });
});