import { describe, it, expect, vi, beforeEach } from 'vitest';

const authService = require('../src/services/auth.service');
const responseUtils = require('../src/utils/response');

const loginSpy = vi.spyOn(authService, 'login');
const logoutSpy = vi.spyOn(authService, 'logout');
const responseOkSpy = vi.spyOn(responseUtils, 'ok');

const AuthController = require('../src/controller/auth.controller');

describe('AuthController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {

    vi.clearAllMocks();
    
    req = {
      body: {},
      headers: {},
    };
    
    res = {}; 
    next = vi.fn();
  });

  describe('login', () => {
    it('should call authService.login and return success response when credentials are valid', async () => {
      req.body = { email: 'admin@cakelytics.com', password: 'password123' };
      const mockResult = { token: 'mock-jwt-token', admin: { id: '1', email: 'admin@cakelytics.com' } };
      
      loginSpy.mockImplementation(() => Promise.resolve(mockResult));
      responseOkSpy.mockImplementation(() => {});

      await AuthController.login(req, res, next);

      expect(loginSpy).toHaveBeenCalledWith('admin@cakelytics.com', 'password123');
      expect(responseOkSpy).toHaveBeenCalledWith(res, mockResult, 'Login successful');
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch errors thrown by authService.login and forward them to next()', async () => {
      req.body = { email: 'admin@cakelytics.com', password: 'wrongpassword' };
      const mockError = new Error('Invalid credentials');
      
      loginSpy.mockImplementation(() => Promise.reject(mockError));

      await AuthController.login(req, res, next);

      expect(loginSpy).toHaveBeenCalledWith('admin@cakelytics.com', 'wrongpassword');
      expect(next).toHaveBeenCalledWith(mockError);
      expect(responseOkSpy).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should extract the token from Bearer authorization header and logout successfully', async () => {
      req.headers.authorization = 'Bearer valid-mock-token-999';
      
      logoutSpy.mockImplementation(() => Promise.resolve(true));
      responseOkSpy.mockImplementation(() => {});

      await AuthController.logout(req, res, next);

      expect(logoutSpy).toHaveBeenCalledWith('valid-mock-token-999');
      expect(responseOkSpy).toHaveBeenCalledWith(res, null, 'Logged out');
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass null to authService.logout if authorization header is missing or empty', async () => {
      req.headers.authorization = undefined;
      
      logoutSpy.mockImplementation(() => Promise.resolve(true));
      responseOkSpy.mockImplementation(() => {});

      await AuthController.logout(req, res, next);

      expect(logoutSpy).toHaveBeenCalledWith(null);
      expect(responseOkSpy).toHaveBeenCalledWith(res, null, 'Logged out');
      expect(next).not.toHaveBeenCalled();
    });

    it('should pass null to authService.logout if header does not start with Bearer', async () => {
      req.headers.authorization = 'MalformedTokenWithoutBearerWord';
      
      logoutSpy.mockImplementation(() => Promise.resolve(true));
      responseOkSpy.mockImplementation(() => {});

      await AuthController.logout(req, res, next);

      expect(logoutSpy).toHaveBeenCalledWith(null);
      expect(responseOkSpy).toHaveBeenCalledWith(res, null, 'Logged out');
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch errors thrown by authService.logout and forward them to next()', async () => {
      req.headers.authorization = 'Bearer problematic-token';
      const mockError = new Error('Token is already blacklisted or expired');
      
      logoutSpy.mockImplementation(() => Promise.reject(mockError));

      await AuthController.logout(req, res, next);

      expect(logoutSpy).toHaveBeenCalledWith('problematic-token');
      expect(next).toHaveBeenCalledWith(mockError);
      expect(responseOkSpy).not.toHaveBeenCalled();
    });
  });
});