require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 1. Kumonekta sa Totoong Test Database gamit ang Admin Key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

// ==========================================
// TINA'S PART: INVENTORY SEED & CLEANUP
// ==========================================
async function seedInventory() {
  console.log("🧹 Nililinis ang Inventory para sa E2E Test...");

  // 👉 DITO NATIN NILAGAY ANG USER CREATION (Para laging nandoon ang user)
  console.log("👤 Nag-a-add ng test user...");
  await supabase.auth.admin.createUser({
    email: 'tinadepadua19@gmail.com',
    password: 'Araymo.123',
    email_confirm: true
  }).catch(err => console.log("Info: User baka nage-exist na, okay lang yan."));

  const tablesToClear = ['waste_logs', 'recipes', 'materials', 'ingredients'];

  for (const table of tablesToClear) {
    const { error } = await supabase
      .from(table)
      .delete()
      .not('id', 'is', null);
      
    if (error) {
      console.error(`❌ Error sa pag-clear ng ${table}:`, error.message);
    }
  }
  console.log("✅ Inventory malinis na at ready na sa test!");
}

// ... (yung ibang functions gaya ng seedPOS at seedAnalytics ay stay lang dito)

// ==========================================
// MAIN RUNNER
// ==========================================
async function runSeed() {
  console.log("🚀 Starting Database Seeding/Reset...");
  
  // Patatakbuhin lahat
  await seedInventory();
  // await seedPOS(); 
  // await seedAnalytics();
  
  console.log("🎉 All done! Ready na mag-test.");
  process.exit(0);
}

runSeed();