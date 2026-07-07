// MOCK 1: Pigilan ang pag-load ng totoong Supabase config
vi.mock('../../../src/config/supabase.js', () => ({
  supabase: {} 
}));

const { AuthModel } = require('../../../src/model/auth.model.js');

describe('AuthModel', () => {

  beforeEach(() => {
    vi.clearAllMocks();

    // MOCK 2: I-fake ang isasagot ng database
    vi.spyOn(AuthModel, 'signIn').mockImplementation(async (email, password) => {
      // Kung tama ang credentials na ginamit mo
      if (email === 'admin@cakelytics.com' && password === 'password123') {
        return { data: { user: { email: 'admin@cakelytics.com' } }, error: null };
      }
      // Lahat ng iba (invalid email, wrong pass) ay babato ng error
      return { data: null, error: new Error('Invalid credentials') };
    });

    vi.spyOn(AuthModel, 'getAdminById').mockImplementation(async (id) => {
      return { data: null, error: new Error('Admin not found') };
    });
  });

  // signIn
  it('should return an error when signing in with an invalid email format', async () => {
    const { error } = await AuthModel.signIn('notanemail', 'password123');
    expect(error).not.toBeNull();
  });

  it('should return an error when signing in with a non-existent email', async () => {
    const { error } = await AuthModel.signIn('nonexistent@email.com', 'password123');
    expect(error).not.toBeNull();
  });

  it('should return an error when signing in with a wrong password', async () => {
    const { error } = await AuthModel.signIn('admin@cakelytics.com', 'wrongpassword');
    expect(error).not.toBeNull();
  });

  // getAdminById
  it('should return an error when fetching an admin with a non-existent id', async () => {
    const { error } = await AuthModel.getAdminById('00000000-0000-0000-0000-000000000000');
    expect(error).not.toBeNull();
  });

  it('should return an error when fetching an admin with an invalid uuid format', async () => {
    const { error } = await AuthModel.getAdminById('not-a-valid-uuid');
    expect(error).not.toBeNull();
  });
});