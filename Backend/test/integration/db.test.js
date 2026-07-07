require('dotenv').config();
const { supabase } = require('../../src/config/supabase.js');

describe('Validate database connection', () => {
  it('should successfully connect to database', async () => {
    const { error } = await supabase.auth.getSession();

    expect(error).toBeNull();
  });
});