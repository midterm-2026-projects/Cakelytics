const responseUtils = require('../../../src/utils/response.js');

responseUtils.ok = vi.fn();
responseUtils.fail = vi.fn();

const { AuthController } = require('../../../src/controllers/auth.controller.js');
const { AuthService } = require('../../../src/services/auth.service.js');
const { LoginSchema } = require('../../../src/schemas/index.js');

describe('AuthController', () => {
  let req, res, next;

  beforeEach(() => {

    vi.clearAllMocks(); 

    vi.spyOn(AuthService, 'login');
    vi.spyOn(AuthService, 'getProfile');
    vi.spyOn(LoginSchema, 'parse');

    req = { body: {}, admin: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  describe('login()', () => {
    it('should call ok() when login is successful', async () => {

      const mockBody = { email: 'admin@cakelytics.com', password: '123' };
      const mockResult = { token: 'fake-token' };
      
      req.body = mockBody;
      LoginSchema.parse.mockReturnValue(mockBody);
      AuthService.login.mockResolvedValue(mockResult);

      await AuthController.login(req, res, next);

      expect(LoginSchema.parse).toHaveBeenCalledWith(mockBody);
      expect(AuthService.login).toHaveBeenCalledWith(mockBody.email, mockBody.password);
      expect(responseUtils.ok).toHaveBeenCalledWith(res, mockResult, 'Login successful');
    });

    it('should return 401 when a credential error is thrown', async () => {
      LoginSchema.parse.mockReturnValue(req.body);
      AuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await AuthController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
    });

    it('should call next() for other unknown errors', async () => {
      const dbError = new Error('Database connection failed');
      LoginSchema.parse.mockReturnValue(req.body);
      AuthService.login.mockRejectedValue(dbError);

      await AuthController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('logout()', () => {
    it('should call ok() to clear the session', () => {
      AuthController.logout(req, res);
      expect(responseUtils.ok).toHaveBeenCalledWith(res, null, 'Logged out');
    });
  });

  describe('me()', () => {
    it('should call ok() with admin profile data', async () => {
      const mockAdmin = { id: 'u-1', name: 'Admin' };
      req.admin = { id: 'u-1' };
      AuthService.getProfile.mockResolvedValue(mockAdmin);

      await AuthController.me(req, res, next);

      expect(AuthService.getProfile).toHaveBeenCalledWith('u-1');
      expect(responseUtils.ok).toHaveBeenCalledWith(res, mockAdmin);
    });

    it('should call next() when getProfile throws an error', async () => {
      const error = new Error('Admin not found');
      req.admin = { id: 'u-1' };
      AuthService.getProfile.mockRejectedValue(error);

      await AuthController.me(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});