const { getSupabase } = require('../config/supabase');

const ProductModel = {
  async findAll(filters = {}) {
    let query = getSupabase()
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.activeOnly !== false) {
      query = query.eq('is_active', true);
    }

    return query;
  },

  async findById(id) {
    return getSupabase()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return getSupabase()
      .from('products')
      .insert(payload)
      .select()
      .single();
  },
};

module.exports = { ProductModel };
