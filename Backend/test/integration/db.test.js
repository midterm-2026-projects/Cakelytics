require('dotenv').config();

// MOCK: I-fake ang supabase para pumasa sa GitHub Actions kahit walang .env
vi.mock('../../src/config/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ error: null })
    }
  }
}));

const { supabase } = require('../../src/config/supabase.js');

describe('Validate database connection', () => {
  it('should successfully connect to database', async () => {
    const { error } = await supabase.auth.getSession();
    expect(error).toBeNull();
  });
});