const { AuthModel } = require('../../src/model/auth.model.js');
const { login, getProfile, verifyToken } = require('../../src/services/auth.service.js');

describe('AuthService', () => {
  beforeEach(() => {
    // I-reset ang lahat ng mocks per test para walang leak ng data
    vi.restoreAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    // I-spy ang methods ng AuthModel
    vi.spyOn(AuthModel, 'signIn');
    vi.spyOn(AuthModel, 'getAdminById');
  });

  it('should return a valid session token when login is called with correct admin credentials', async () => {
    // I-setup ang mock data para sa successful login
    AuthModel.signIn.mockResolvedValue({ data: { user: { id: 'u-1' } }, error: null });
    AuthModel.getAdminById.mockResolvedValue({
      data: { id: 'u-1', name: 'Admin', email: 'admin@cakelytics.com' },
      error: null,
    });

    const result = await login('admin@cakelytics.com', '1234');
    
    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
    expect(result.token.length).toBeGreaterThan(0);
    expect(result.admin.email).toBe('admin@cakelytics.com');
  });

  it('should reject the login attempt when credentials are incorrect', async () => {
    // I-setup ang mock data para sa failed login
    AuthModel.signIn.mockResolvedValue({ data: null, error: new Error('Invalid credentials') });

    // Gumamit ng .rejects.toThrow kapag nagte-test ng errors sa async functions
    await expect(login('admin@cakelytics.com', 'wrongpass')).rejects.toThrow('Invalid email or password');
    await expect(login('notreal@cakelytics.com', '1234')).rejects.toThrow('Invalid email or password');
  });

  it('should reject the login attempt when email or password is missing', async () => {
    // Assuming the validation happens before the AuthModel is called, 
    // or if the model throws this error.
    await expect(login('', '1234')).rejects.toThrow('Invalid email or password');
    await expect(login('admin@cakelytics.com', '')).rejects.toThrow('Invalid email or password');
  });

  it('should return admin data when getProfile succeeds', async () => {
    AuthModel.getAdminById.mockResolvedValue({ data: { id: 'u-1', name: 'Admin' }, error: null });
    const result = await getProfile('u-1');
    expect(result.name).toBe('Admin');
  });
});