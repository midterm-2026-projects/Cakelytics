const { OrderModel } = require('../model/order.model');

function buildOrderNumber() {
  return `ORD-${Date.now()}`;
}

const OrderService = {
  async getOrders(filters) {
    const { data, error } = await OrderModel.findAll(filters);
    if (error) throw error;
    return data;
  },

  async getOrderById(id) {
    const { data, error } = await OrderModel.findById(id);
    if (error) throw error;
    return data;
  },

  async createOrder(body) {
    const payload = {
      order_number: body.order_number || buildOrderNumber(),
      customer_name: body.customer_name || null,
      order_type: body.order_type || 'Pre-order',
      status: body.status || 'Pending',
      subtotal: body.subtotal || 0,
      additional_fee: body.additional_fee || 0,
      discount: body.discount || 0,
      grand_total: body.grand_total || 0,
    };

    const { data, error } = await OrderModel.create(payload);
    if (error) throw error;
    return data;
  },
};

module.exports = { OrderService };
