<<<<<<< HEAD
const { OrderItemModel } = require('../../model/orderingModels/orderItem.model');

function buildOrderItemPayload(body) {
  const quantity = Number(body.quantity || 1);
  const unitPrice = Number(body.unit_price || 0);

  return {
    order_id: body.order_id,
    product_id: body.product_id || null,
    product_name: body.product_name,
    variant_label: body.variant_label || null,
    quantity,
    unit_price: unitPrice,
    total_price: body.total_price !== undefined ? Number(body.total_price) : quantity * unitPrice,
  };
}

const OrderItemService = {
  async getOrderItems(filters = {}) {
    const { data, error } = await OrderItemModel.findAll(filters);
    if (error) throw error;
    return data;
  },

  async getOrderItemById(id) {
    const { data, error } = await OrderItemModel.findById(id);
    if (error) throw error;
    return data;
  },

  async createOrderItem(body) {
    const { data, error } = await OrderItemModel.create(buildOrderItemPayload(body));
    if (error) throw error;
    return data;
  },

  async createOrderItems(items) {
    const payload = items.map(buildOrderItemPayload);
    const { data, error } = await OrderItemModel.createMany(payload);
    if (error) throw error;
    return data;
  },

  async updateOrderItem(id, body) {
    const payload = {};

    if (body.product_id !== undefined) payload.product_id = body.product_id || null;
    if (body.product_name !== undefined) payload.product_name = body.product_name;
    if (body.variant_label !== undefined) payload.variant_label = body.variant_label || null;
    if (body.quantity !== undefined) payload.quantity = Number(body.quantity);
    if (body.unit_price !== undefined) payload.unit_price = Number(body.unit_price);

    if (body.total_price !== undefined) {
      payload.total_price = Number(body.total_price);
    } else if (payload.quantity !== undefined && payload.unit_price !== undefined) {
      payload.total_price = payload.quantity * payload.unit_price;
    }

    const { data, error } = await OrderItemModel.update(id, payload);
    if (error) throw error;
    return data;
  },

  async deleteOrderItem(id) {
    const { error } = await OrderItemModel.remove(id);
    if (error) throw error;
    return { id };
  },

  async deleteItemsByOrderId(orderId) {
    const { error } = await OrderItemModel.removeByOrderId(orderId);
    if (error) throw error;
    return { order_id: orderId };
  },
};

module.exports = { OrderItemService, buildOrderItemPayload };
=======
const { supabase } = require("../../config/supabase");
const OrderItem = require("../../model/orderingModels/orderItem.model");

class OrderItemService {
  async create(data) {
    const orderItem = new OrderItem(data);
    orderItem.validate();

    const { data: createdOrderItem, error } = await supabase
      .from(OrderItem.table)
      .insert(orderItem.toJSON())
      .select()
      .single();

    if (error) throw error;

    return createdOrderItem;
  }

  async getAll() {
    const { data, error } = await supabase
      .from(OrderItem.table)
      .select("*");

    if (error) throw error;

    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from(OrderItem.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async getByOrderId(orderId) {
    const { data, error } = await supabase
      .from(OrderItem.table)
      .select("*")
      .eq("order_id", orderId);

    if (error) throw error;

    return data;
  }

  async update(id, updates) {
    if (
      updates.quantity !== undefined &&
      updates.unit_price !== undefined &&
      updates.total_price === undefined
    ) {
      updates.total_price =
        Number(updates.quantity) * Number(updates.unit_price);
    }

    const { data, error } = await supabase
      .from(OrderItem.table)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from(OrderItem.table)
      .delete()
      .eq("id", id);

    if (error) throw error;

    return {
      message: "Order item deleted successfully.",
    };
  }
}

module.exports = new OrderItemService();
>>>>>>> 7d687d6e60bd3be3ddf78accceb552bd685c9263
