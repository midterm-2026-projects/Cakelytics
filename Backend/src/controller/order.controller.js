// =============================================================================
// Week 5 — Day 1: Order Status Monitoring Integration
// Feature: Status Updates (Controller)
// -----------------------------------------------------------------------------
// Handles HTTP requests for CRUD order operations including:
//   • getAllOrders — fetch with optional ?status= filter
//   • getOrderById — retrieve a single order
//   • updateStatus — PATCH endpoint to change order status
// =============================================================================

const { OrderService } = require('../services/orders.service');

const orderController = {
  // GET /api/orders
  // Frontend expects: { success: true, data: [...] }
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await OrderService.getAllOrders(req.query);
      res.status(200).json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/orders/:id
  getOrderById: async (req, res, next) => {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const orderId = req.params.id || req.body.id;
      const { status } = req.body;

      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId is required' });
      }
      if (!status) {
        return res.status(400).json({ success: false, message: 'status is required' });
      }

      const updated = await OrderService.updateStatus(orderId, status);

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = orderController;
