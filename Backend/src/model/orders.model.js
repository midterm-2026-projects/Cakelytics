const { supabase } = require('../config/supabase.js');

const TABLE = 'orders';

const OrdersModel = {
  /**
   * Fetch orders filtered by updated_at date range.
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   * @param {object} [opts]
   * @param {string} [opts.columns='*'] - comma-separated column list
   * @param {boolean} [opts.excludeCancelled=false] - filter out status='Cancelled'
   */
  getByDateRange: async (
    startDate,
    endDate,
    { columns = '*', excludeCancelled = false } = {}
  ) => {
    let query = supabase
      .from(TABLE)
      .select(columns)
      // PINALITAN: Mula 'created_at' naging 'updated_at' na
      .gte('updated_at', startDate)
      .lte('updated_at', endDate);

    if (excludeCancelled) {
      query = query.neq('status', 'Cancelled');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

module.exports = OrdersModel;