<<<<<<< HEAD
const { supabase } = require('../../config/supabase');

const ORDER_SELECT = `
  *,
  customers(*),
  order_items(*)
`;

const OrderModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('orders')
      .select(ORDER_SELECT)
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }

    if (filters.source && filters.source !== 'All') {
      query = query.eq('source', filters.source);
    }

    if (filters.orderType && filters.orderType !== 'All') {
      query = query.eq('order_type', filters.orderType);
    }

    if (filters.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    if (filters.pickupDate) {
      query = query.eq('pickup_date', filters.pickupDate);
    }

    if (filters.search) {
      query = query.ilike('order_number', `%${filters.search}%`);
    }

    return query;
  },

  async findById(id) {
    return supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return supabase
      .from('orders')
      .insert(payload)
      .select()
      .single();
  },

  async update(id, payload) {
    return supabase
      .from('orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  async updateStatus(id, status) {
    return supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return supabase
      .from('orders')
      .delete()
      .eq('id', id);
  },
};

module.exports = { OrderModel };
=======
const crypto = require("crypto");
const { supabase } = require("../../config/supabase");

class Order {
  // ==========================
  // Validation
  // ==========================
  static validate(data) {
    if (!data.order_type) {
      throw new Error("Order type is required.");
    }

    if (!["Pre-Order", "Buy Now"].includes(data.order_type)) {
      throw new Error("Invalid order type.");
    }

    if (!data.source) {
      throw new Error("Order source is required.");
    }

    if (!["online", "walk-in"].includes(data.source)) {
      throw new Error("Invalid order source.");
    }

    if (!data.payment_type) {
      throw new Error("Payment type is required.");
    }

    if (!["full", "deposit"].includes(data.payment_type)) {
      throw new Error("Invalid payment type.");
    }

    if (typeof data.subtotal !== "number") {
      throw new Error("Subtotal must be a number.");
    }

    if (data.subtotal < 0) {
      throw new Error("Subtotal cannot be negative.");
    }

    if (!data.pickup_date) {
      throw new Error("Pickup date is required.");
    }

    if (!data.pickup_time) {
      throw new Error("Pickup time is required.");
    }

    return true;
  }

  // ==========================
  // Create
  // ==========================
  static async create(data) {
    Order.validate(data);

    const subtotal = Number(data.subtotal || 0);
    const additional_charge = Number(data.additional_charge || 0);
    const discount = Number(data.discount || 0);

    const grand_total =
      subtotal +
      additional_charge -
      discount;

    const amount_paid = Number(data.amount_paid || 0);

    const balance =
      grand_total -
      amount_paid;

    const payload = {
      id: crypto.randomUUID(),

      order_number:
        data.order_number ||
        `ORD-${Date.now()}`,

      customer_id:
        data.customer_id || null,

      placed_by_admin:
        data.placed_by_admin || false,

      order_type:
        data.order_type,

      source:
        data.source,

      status:
        data.status || "Confirmed",

      subtotal,

      additional_charge,

      discount,

      grand_total,

      payment_type:
        data.payment_type,

      amount_paid,

      balance,

      pickup_date:
        data.pickup_date,

      pickup_time:
        data.pickup_time,

      special_instructions:
        data.special_instructions || null,

      customer_reference_url:
        data.customer_reference_url || null,

      paymongo_payment_id:
        data.paymongo_payment_id || null
    };

    const { data: order, error } =
      await supabase
        .from("orders")
        .insert(payload)
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return order;
  }

  // ==========================
  // Read All
  // ==========================
  static async findAll() {
    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // ==========================
  // Read By ID
  // ==========================
  static async findById(id) {
    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // ==========================
  // Update
  // ==========================
  static async update(id, updates) {
    if (updates.subtotal !== undefined) {
      const subtotal =
        Number(updates.subtotal);

      const additional =
        Number(
          updates.additional_charge || 0
        );

      const discount =
        Number(
          updates.discount || 0
        );

      const amountPaid =
        Number(
          updates.amount_paid || 0
        );

      updates.grand_total =
        subtotal +
        additional -
        discount;

      updates.balance =
        updates.grand_total -
        amountPaid;
    }

    updates.updated_at =
      new Date().toISOString();

    const { data, error } =
      await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // ==========================
  // Update Status
  // ==========================
  static async updateStatus(
    id,
    status
  ) {
    if (
      ![
        "Confirmed",
        "Ready",
        "Completed",
        "Cancelled",
      ].includes(status)
    ) {
      throw new Error(
        "Invalid order status."
      );
    }

    return await Order.update(
      id,
      { status }
    );
  }

  // ==========================
  // Delete
  // ==========================
  static async delete(id) {
    const existing =
      await Order.findById(id);

    const { error } =
      await supabase
        .from("orders")
        .delete()
        .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return existing;
  }
}

module.exports = Order;
>>>>>>> 7d687d6e60bd3be3ddf78accceb552bd685c9263
