const { CustomerModel } = require('../model/customer.model');

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

  // ADDED: alias so it matches what customer.controller.js actually calls
  async getAllCustomers(filters = {}) {
    return this.getCustomers(filters);
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

  // ADDED: was missing entirely — controller was calling a nonexistent method
  async verifyOrderAndCustomer(orderRef, phone) {
    return CustomerModel.verifyOrderAndCustomer(orderRef, phone);
  },
};

module.exports = { CustomerService, buildCustomerPayload };