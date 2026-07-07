const { getSupabase } = require('../config/supabase');

const SalesModel = {
  async findAll(limit = 50) {
    return getSupabase()
      .from('sales')
      .select('*')
      .order('sold_at', { ascending: false })
      .limit(limit);
  },

  async create(payload) {
    return getSupabase()
      .from('sales')
      .insert(payload)
      .select()
      .single();
  },
};

const OrderTransactionModel = {
  async findByOrderId(orderId) {
    return getSupabase()
      .from('order_transactions')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
  },

  async createMany(items) {
    return getSupabase()
      .from('order_transactions')
      .insert(items)
      .select();
  },
};

module.exports = { SalesModel, OrderTransactionModel };
