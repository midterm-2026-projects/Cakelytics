const { supabase } = require('../../config/supabase');

const ORDER_SELECT = `
  *,
  customers(*),
  order_items(*)
`;

const OrderModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('orders')
      .select(ORDER_SELECT)
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }

    if (filters.source && filters.source !== 'All') {
      query = query.eq('source', filters.source);
    }

    if (filters.orderType && filters.orderType !== 'All') {
      query = query.eq('order_type', filters.orderType);
    }

    if (filters.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters.pickupDate) {
      query = query.eq('pickup_date', filters.pickupDate);
    }

    if (filters.search) {
      // FIX: Clean template literal string wrapping
      query = query.ilike('order_number', `%${filters.search}%`);
    }

    return query;
  },

  async findById(id) {
    return supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return supabase
      .from('orders')
      .insert(payload)
      .select()
      .single();
  },

  async update(id, payload) {
    return supabase
      .from('orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  // FIX: Ensure this method is correctly part of the exported OrderModel object
  async updateStatus(id, status) {
    return supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return supabase
      .from('orders')
      .delete()
      .eq('id', id);
  },
};

module.exports = { OrderModel };