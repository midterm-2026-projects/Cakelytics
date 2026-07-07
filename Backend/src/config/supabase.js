require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Debug log — pwede mong tanggalin to pag production na
console.log('--- SUPABASE CONFIG CHECK ---');
console.log('URL:', process.env.SUPABASE_URL);
console.log('KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'May laman yung Key!' : 'UNDEFINED / WALANG LAMAN');
console.log('-----------------------------');

module.exports = { supabase };


