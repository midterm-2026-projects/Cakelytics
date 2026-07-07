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