const { supabase } = require('../../config/supabase.js');

const InventoryLogModel = {
  logHistory: async (data) => {
    const { error } = await supabase.from('inventory_logs').insert(data);
    if (error) {
      console.error('ERROR SAVING LOG:', error); // Lalabas sa terminal kung bakit hindi pumasok
    }
  },
};

module.exports = { InventoryLogModel };