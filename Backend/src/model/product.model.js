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

  // == MITCH == //
  // Variant-joined lookup, split out from findById so the plain findById stays
  // predictable for callers/tests that just want the bare product row. Use this
  // instead whenever you need the product's variants attached (e.g. product detail).
  async findByIdWithVariants(id) {
    return getSupabase()
      .from('products')
      .select('*, product_variants(*)')
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

  // == PRINCES == //
  async update(id, payload) {
    const idInfo = { id, asString: String(id) };

    // Pre-check for RLS/Existence
    const preCheck = await getSupabase()
      .from('products')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    const { data, error } = await getSupabase()
      .from('products')
      .update(payload)
      .eq('id', id)
      .select();

    const updatedRow = Array.isArray(data) ? data[0] : null;

    if (!error && !updatedRow) {
      const preCheckFound = !!preCheck?.data;
      const message = preCheckFound
        ? `Product exists but update affected 0 rows (possible RLS/policy) for id=${idInfo.asString}`
        : `Product not found for id=${idInfo.asString}`;

      const notFoundErr = new Error(message);
      notFoundErr.status = preCheckFound ? 403 : 404;
      throw notFoundErr;
    }

    if (error) throw error;
    return { data: updatedRow, error };
  },

  async delete(id) {
    const idInfo = { id, asString: String(id) };

    const preCheck = await getSupabase()
      .from('products')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    const { data, error } = await getSupabase()
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    const deletedRow = Array.isArray(data) ? data[0] : null;

    if (!error && !deletedRow) {
      const preCheckFound = !!preCheck?.data;
      const message = preCheckFound
        ? `Product exists but delete affected 0 rows (possible RLS/policy) for id=${idInfo.asString}`
        : `Product not found for id=${idInfo.asString}`;

      const notFoundErr = new Error(message);
      notFoundErr.status = preCheckFound ? 403 : 404;
      throw notFoundErr;
    }

    if (error) throw error;
    return { data: deletedRow, error };
  },

  // == MITCH == //
  async getDailyLimit(productId) {
    return getSupabase()
      .from('products')
      .select('daily_limit')
      .eq('id', productId)
      .single();
  },
};

module.exports = { ProductModel };