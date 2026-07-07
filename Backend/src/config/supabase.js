require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("BABALA: Walang nakitang Supabase credentials. Gumagamit ng Fake Client.");
  
  supabase = {
    auth: {
      getSession: async () => ({ error: null }),
      signInWithPassword: async ({ email, password }) => {
        // NGAYON: Kahit anong email, basta tama ang password, pasok!
        if (password === 'Araymo.123') {
          return { data: { user: { id: 'u-1', email: email } }, error: null };
        }
        return { data: null, error: new Error('Invalid credentials') };
      },
      admin: {
        getUserById: async (id) => ({ data: { user: { id: 'u-1', name: 'Admin', email: 'tinadepadua19@gmail.com' } }, error: null })
      }
    },
    from: (tableName) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ 
            data: { id: 'u-1', name: 'Admin', email: 'tinadepadua19@gmail.com' }, 
            error: null 
          })
        }),
        single: async () => ({ 
          data: { id: 'u-1', name: 'Admin', email: 'tinadepadua19@gmail.com' }, 
          error: null 
        })
      })
    })
  };
}

module.exports = { supabase };