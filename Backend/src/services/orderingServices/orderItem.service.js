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