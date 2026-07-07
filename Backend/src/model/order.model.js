const { getSupabase } = require('../config/supabase');

const OrderModel = {
  async findAll(filters = {}) {
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

  async findById(id) {
    return getSupabase()
      .from('orders')
      .select('*, order_transactions(*)')
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

module.exports = { OrderModel };
