// const { supabase } = require('../../config/supabase');

// const CustomerModel = {
//   async findAll(filters = {}) {
//     let query = supabase
//       .from('customers')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (filters.search) {
//   query = query.or(
//     `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
//   );
// }

//     return query;
//   },

//   async findById(id) {
//     return supabase
//       .from('customers')
//       .select('*')
//       .eq('id', id)
//       .single();
//   },

//   async create(payload) {
//     return supabase
//       .from('customers')
//       .insert(payload)
//       .select()
//       .single();
//   },

//   async update(id, payload) {
//     return supabase
//       .from('customers')
//       .update(payload)
//       .eq('id', id)
//       .select()
//       .single();
//   },

//   async remove(id) {
//     return supabase
//       .from('customers')
//       .delete()
//       .eq('id', id);
//   },
// };

// module.exports = { CustomerModel };

const { supabase } = require('../../config/supabase');

const CustomerModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    return query;
  },

  async findById(id) {
    return supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return supabase
      .from('customers')
      .insert(payload)
      .select()
      .single();
  },

  async update(id, payload) {
    return supabase
      .from('customers')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return supabase
      .from('customers')
      .delete()
      .eq('id', id);
  },
};

module.exports = { CustomerModel };