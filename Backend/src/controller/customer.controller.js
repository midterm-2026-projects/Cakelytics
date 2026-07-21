const { CustomerService } = require('../services/customer.service');

const customerController = {
  async getAllCustomers(req, res) {
    try {
      const customers = await CustomerService.getAllCustomers(req.query);
      return res.status(200).json({ success: true, data: customers });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await CustomerService.getCustomerById(id);
      if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

      return res.status(200).json({ success: true, data: customer });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async createCustomer(req, res) {
    try {
      // VALIDATION: Siguraduhing may pangalan at phone bago ipadala sa Supabase
      const { name, phone } = req.body;
      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Name and phone number are required fields!'
        });
      }

      const newCustomer = await CustomerService.createCustomer(req.body);
      return res.status(201).json({ success: true, data: newCustomer });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // FIXED: was calling CustomerService.verifyOrderAndCustomer which didn't
  // exist, and was checking a `.exists` field the model never returns.
  async verifyCustomerAndOrder(req, res) {
    try {
      const { order_ref, phone } = req.query;

      if (!order_ref || !phone) {
        return res.status(400).json({
          success: false,
          message: 'order_ref and phone are required query params',
        });
      }

      const verificationResult = await CustomerService.verifyOrderAndCustomer(order_ref, phone);

      if (verificationResult.error) {
        return res.status(500).json({
          success: false,
          message: verificationResult.error.message || 'Verification failed',
        });
      }

      if (!verificationResult.data) {
        // no match found — reason explains why (bad phone, bad order ref, or mismatch)
        return res.status(400).json({
          success: false,
          message: verificationResult.reason || 'Verification failed',
        });
      }

      return res.status(200).json({ success: true, data: verificationResult.data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = customerController;