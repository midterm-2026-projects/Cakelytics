require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

// Hindi na tayo magt-throw ng error dito!
// Imbes na mag-crash, i-che-check muna natin kung may laman ang .env
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("BABALA: Walang nakitang Supabase credentials. Naka-null ang database config.");
}

module.exports = { supabase };