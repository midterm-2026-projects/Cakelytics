const { supabase } = require('../../config/supabase');

const OrderItemModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('order_items')
      .select(', products()');

    if (filters.orderId) {
      query = query.eq('order_id', filters.orderId);
    }

    if (filters.productId) {
      query = query.eq('product_id', filters.productId);
    }

    return query;
  },

  async findById(id) {
    return supabase
      .from('order_items')
      .select(', products()')
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return supabase
      .from('order_items')
      .insert(payload)
      .select()
      .single();
  },

  async createMany(items) {
    return supabase
      .from('order_items')
      .insert(items)
      .select();
  },

  async update(id, payload) {
    return supabase
      .from('order_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return supabase
      .from('order_items')
      .delete()
      .eq('id', id);
  },

  async removeByOrderId(orderId) {
    return supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId);
  },
};

module.exports = { OrderItemModel };