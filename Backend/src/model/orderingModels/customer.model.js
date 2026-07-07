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