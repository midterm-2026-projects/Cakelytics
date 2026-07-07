const OrderModel = require("../../model/orderingModels/order.model");

const OrderService = {
  // ==========================
  // Get All Orders
  // ==========================
  async getOrders() {
    return await OrderModel.findAll();
  },

  // ==========================
  // Get Order By ID
  // ==========================
  async getOrderById(id) {
    if (!id) {
      throw new Error("Order ID is required.");
    }

    return await OrderModel.findById(id);
  },

  // ==========================
  // Create Order
  // ==========================
  async createOrder(orderData) {
    return await OrderModel.create(orderData);
  },

  // ==========================
  // Update Order
  // ==========================
  async updateOrder(id, updates) {
    if (!id) {
      throw new Error("Order ID is required.");
    }

    return await OrderModel.update(id, updates);
  },

  // ==========================
  // Update Order Status
  // ==========================
  async updateOrderStatus(id, status) {
    if (!id) {
      throw new Error("Order ID is required.");
    }

    return await OrderModel.updateStatus(id, status);
  },

  // ==========================
  // Delete Order
  // ==========================
  async deleteOrder(id) {
    if (!id) {
      throw new Error("Order ID is required.");
    }

    return await OrderModel.delete(id);
  }
};

module.exports = OrderService;