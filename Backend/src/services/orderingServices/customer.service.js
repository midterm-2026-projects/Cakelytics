<<<<<<< HEAD
const { CustomerModel } = require('../../model/orderingModels/customer.model');

function buildCustomerPayload(body) {
  return {
    name: body.name,
    phone: body.phone,
    alt_phone: body.alt_phone || '',
    facebook: body.facebook || '',
    email: body.email || null,
  };
}

const CustomerService = {
  async getCustomers(filters = {}) {
    const { data, error } = await CustomerModel.findAll(filters);
    if (error) throw error;
    return data;
  },

  async getCustomerById(id) {
    const { data, error } = await CustomerModel.findById(id);
    if (error) throw error;
    return data;
  },

  async createCustomer(body) {
    const { data, error } = await CustomerModel.create(buildCustomerPayload(body));
    if (error) throw error;
    return data;
  },

  async updateCustomer(id, body) {
    const payload = {};

    if (body.name !== undefined) payload.name = body.name;
    if (body.phone !== undefined) payload.phone = body.phone;
    if (body.alt_phone !== undefined) payload.alt_phone = body.alt_phone;
    if (body.facebook !== undefined) payload.facebook = body.facebook;
    if (body.email !== undefined) payload.email = body.email || null;

    const { data, error } = await CustomerModel.update(id, payload);
    if (error) throw error;
    return data;
  },

  async deleteCustomer(id) {
    const { error } = await CustomerModel.remove(id);
    if (error) throw error;
    return { id };
  },
};

module.exports = { CustomerService, buildCustomerPayload };
=======
const { supabase } = require("../../config/supabase");
const Customer = require("../../model/orderingModels/customer.model");

class CustomerService {
  async create(data) {
    const customer = new Customer(data);
    customer.validate();

    const { data: createdCustomer, error } = await supabase
      .from(Customer.table)
      .insert(customer.toJSON())
      .select()
      .single();

    if (error) throw error;

    return createdCustomer;
  }

  async getAll() {
    const { data, error } = await supabase
      .from(Customer.table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from(Customer.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from(Customer.table)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from(Customer.table)
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { message: "Customer deleted successfully." };
  }
}

module.exports = new CustomerService();
>>>>>>> 7d687d6e60bd3be3ddf78accceb552bd685c9263
