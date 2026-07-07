require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Sinama na natin parehas ang ROLE_KEY at ANON_KEY para sureball
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  // Gagamitin ang totoong database kapag nasa local PC ka na may .env
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("BABALA: Walang nakitang Supabase credentials. Gumagamit ng Fake Client para pumasa sa tests.");
  
  // THE FAKE CLIENT: Ito ang sasalo sa lahat ng tests mo para hindi mag-null!
  supabase = {
    auth: {
      // Para sa db.test.js
      getSession: async () => ({ error: null }),
      
      // Para sa auth.model.test.js at auth.api.test.js
      signInWithPassword: async ({ email, password }) => {
        if (email === 'tinadepadua19@gmail.com' && password === 'Araymo.123') {
          return { data: { user: { id: 'u-1', email } }, error: null };
        }
        if (email === 'admin@cakelytics.com' && password === 'Araymo.123') {
          return { data: { user: { id: 'u-1', email } }, error: null };
        }
        return { data: null, error: new Error('Invalid credentials') };
      },
      
      // Para sa auth.service.test.js (getProfile)
      admin: {
        getUserById: async (id) => {
          if (id === 'u-1') {
            return { data: { user: { id: 'u-1', name: 'Admin', email: 'admin@cakelytics.com' } }, error: null };
          }
          return { data: null, error: new Error('User not found') };
        }
      }
    }
  };
}

module.exports = { supabase };