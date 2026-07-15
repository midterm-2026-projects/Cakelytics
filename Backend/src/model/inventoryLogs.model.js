const { supabase } = require('../config/supabase.js');

const TABLE = 'inventory_logs';

const InventoryLogsModel = {
  
  getByDateRange: async (startDate, endDate, { ascending = true } = {}) => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('item_type, item_name, transaction_type, quantity, cost, action, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending });

    if (error) throw error;
    return data;
  },

};

module.exports = InventoryLogsModel;