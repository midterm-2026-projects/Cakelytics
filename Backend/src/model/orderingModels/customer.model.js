<<<<<<< HEAD
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
=======
const { TABLES, genId } = require("../../config/db");

class Customer {
  constructor(data) {
    this.id = data.id || genId();

    this.name = data.name;
    this.phone = data.phone;
    this.alt_phone = data.alt_phone || null;
    this.facebook = data.facebook || null;
    this.email = data.email || null;

    this.created_at = data.created_at || new Date().toISOString();
  }

  validate() {
    if (!this.name) {
      throw new Error("Customer name is required.");
    }

    if (!this.phone) {
      throw new Error("Customer phone is required.");
    }

    return true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      alt_phone: this.alt_phone,
      facebook: this.facebook,
      email: this.email,
      created_at: this.created_at,
    };
  }

  static get table() {
    return "customers";
  }
}

module.exports = Customer;
>>>>>>> 7d687d6e60bd3be3ddf78accceb552bd685c9263
