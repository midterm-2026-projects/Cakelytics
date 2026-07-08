const { supabase } = require('../../config/supabase');

const PRODUCT_SELECT = `
  *,
  product_variants(*),
  product_date_exceptions(*)
`;

const ProductModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT)
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
    return supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
  },

  async update(id, payload) {
    return supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return supabase
      .from('products')
      .delete()
      .eq('id', id);
  },
};

module.exports = { ProductModel };