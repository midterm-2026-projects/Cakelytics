const { getSupabase } = require('../config/supabase.js');

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
    let query = getSupabase()
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
    async findAll() {
    // Keep consistent return shape with getAllOrders expectations.
    // Also avoid returning the raw { data, error } object.
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*, customers(name, phone), order_items(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload) {
    return getSupabase()
      .from('orders')
      .insert(payload)
      .select()
      .single();
  },
};

module.exports = OrdersModel;