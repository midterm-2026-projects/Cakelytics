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

  // == MITCH == //
  async updateStatus(id, status) {
    return getSupabase()
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
  },

  async createWithItems(orderPayload, itemsPayload) {
    const supabase = getSupabase();

    // Insert the main order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single();

    if (orderError) return { data: null, error: orderError };

    // Insert the linked line items if they exist
    if (itemsPayload && itemsPayload.length > 0) {
      // TAMA: Ginamit ang orderData.id (galing sa DB) para i-link ang order_items
      const mappedItems = itemsPayload.map(item => ({
        ...item,
        order_id: orderData.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items') // Adjust table name to match your DB layout if different
        .insert(mappedItems);

      if (itemsError) return { data: null, error: itemsError };
    }

    return { data: orderData, error: null };
  },

  async findByCustomer(customerId) {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', customerId);

    return { data, error };
  },

  // == PRINCES == //
  // ⚠️ RESOLVED CONFLICT: this used to be FILE 1's filtered version living under the
  // `findAll` name, with FILE 2's simple/no-filter version demoted to `findAllSimple`.
  // Tests (and the rest of the codebase) expect the SIMPLE behavior under `findAll`
  // (order by updated_at, ignores filters entirely) — so that version is now canonical
  // here. The old filtered behavior is preserved below as `findAllFiltered` in case
  // some caller actually wants status/search filtering.
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

  // Former FILE 1 `findAll` — applies status/search filters, orders by created_at.
  // Kept available under this name for any caller that wants filtering.
  async findAllFiltered(filters = {}) {
    let query = getSupabase()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.ilike('order_number', `%${filters.search}%`);
    }

    return query;
  },

  // ⚠️ RESOLVED CONFLICT: this used to be FILE 1's plain version (order_items only)
  // living under the `findById` name, with FILE 2's customer-joined version demoted
  // to `findByIdWithCustomer`. Tests expect the customer-joined behavior under
  // `findById`, so that version is now canonical here. The old plain behavior is
  // preserved below as `findByIdSimple`.
  async findById(id) {
    const { data, error } = await getSupabase()
      .from('orders')
      .select('*, customers(name, phone), order_items(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Former FILE 1 `findById` — selects only order_items, no customer join.
  // Kept available under this name for any caller that wants the lighter query.
  async findByIdSimple(id) {
    return getSupabase()
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();
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