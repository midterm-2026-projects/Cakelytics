const { getSupabase } = require('../config/supabase.js');

const TABLE = 'order_items';

const OrderItemsModel = {
  /**
   * Fetch order_items filtered by their parent order's date range/status.
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   * @param {object} [opts]
   * @param {string} [opts.columns] - comma-separated column list (can embed `orders!inner(...)`, `products(...)`)
   * @param {boolean} [opts.excludeCancelled=true] - filter out orders.status='Cancelled'
   */
  getByOrderDateRange: async (
    startDate,
    endDate,
    { columns = 'quantity, product_name, orders!inner(created_at, status)', excludeCancelled = true } = {}
  ) => {
    // INAYOS: dating "supabase" (bare, hindi na-import) - kailangan tawagin bilang
    // function na "getSupabase()" tulad ng ginagawa ng ibang methods sa file na ito.
    let query = getSupabase()
      .from(TABLE)
      .select(columns)
      .gte('orders.created_at', startDate)
      .lte('orders.created_at', endDate);

    if (excludeCancelled) {
      query = query.neq('orders.status', 'Cancelled');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createMany(items) {
    return getSupabase()
      .from(TABLE)
      .insert(items)
      .select();
  },

  async findByOrderId(orderId) {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },
};

module.exports = OrderItemsModel;