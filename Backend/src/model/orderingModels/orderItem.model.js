<<<<<<< HEAD
const { supabase } = require('../../config/supabase');

const OrderItemModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('order_items')
      .select('*, products(*)');

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
      .select('*, products(*)')
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
=======
const { TABLES, genId } = require("../../config/db");

class OrderItem {
  constructor(data) {
    this.id = data.id || genId();

    this.order_id = data.order_id || null;
    this.product_id = data.product_id || null;

    this.product_name = data.product_name;
    this.variant_label = data.variant_label || null;

    this.quantity = data.quantity;
    this.unit_price = Number(data.unit_price);
    this.total_price =
      data.total_price ??
      Number(data.quantity) * Number(data.unit_price);
  }

  validate() {
    if (!this.product_name) {
      throw new Error("Product name is required.");
    }

    if (
      this.quantity === undefined ||
      this.quantity === null ||
      this.quantity <= 0
    ) {
      throw new Error("Quantity must be greater than zero.");
    }

    if (
      this.unit_price === undefined ||
      this.unit_price === null ||
      this.unit_price < 0
    ) {
      throw new Error("Unit price must be zero or greater.");
    }

    if (
      this.total_price === undefined ||
      this.total_price === null ||
      this.total_price < 0
    ) {
      throw new Error("Total price must be zero or greater.");
    }

    return true;
  }

  toJSON() {
    return {
      id: this.id,
      order_id: this.order_id,
      product_id: this.product_id,
      product_name: this.product_name,
      variant_label: this.variant_label,
      quantity: this.quantity,
      unit_price: this.unit_price,
      total_price: this.total_price,
    };
  }

  static get table() {
    return "order_items";
  }
}

module.exports = OrderItem;
>>>>>>> 7d687d6e60bd3be3ddf78accceb552bd685c9263
