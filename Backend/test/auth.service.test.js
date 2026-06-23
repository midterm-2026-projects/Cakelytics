const { login, logout, verifyToken } = require('../src/services/auth.service.js');
import { describe, it, expect } from 'vitest';

describe('auth.service (mock)', () => {
  it('should return a valid session token when login is called with correct admin credentials', () => {
    const result = login('admin@cakelytics.com', '1234');
    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
    expect(result.token.length).toBeGreaterThan(0);
    expect(result.admin.email).toBe('admin@cakelytics.com');
  });

  it('should reject the login attempt when credentials are incorrect', () => {
    expect(() => login('admin@cakelytics.com', 'wrongpass')).toThrow('Invalid credentials');
    expect(() => login('notreal@cakelytics.com', '1234')).toThrow('Invalid credentials');
  });

  it('should reject the login attempt when email or password is missing', () => {
    expect(() => login('', '1234')).toThrow('Email and password are required');
    expect(() => login('admin@cakelytics.com', '')).toThrow('Email and password are required');
  });

  it('should clear the active session when logout is called', () => {
    const { token } = login('admin@cakelytics.com', '1234');
    expect(verifyToken(token)).not.toBeNull();

    const result = logout(token);
    expect(result).toBe(true);
    expect(verifyToken(token)).toBeNull();
  });

  it('should return false from logout when the token does not exist', () => {
    expect(logout('not-a-real-token')).toBe(false);
  });

  it('should return null from verifyToken for an invalid or unknown token', () => {
    expect(verifyToken('not-a-real-token')).toBeNull();
  });
});