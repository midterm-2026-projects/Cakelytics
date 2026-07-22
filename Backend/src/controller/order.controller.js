// const { OrderService } = require('../../src/services/orders.service'); 

// const orderController = {
//   // GET /api/orders
//   // Frontend expects: { success: true, data: [...] }
//   getAllOrders: async (req, res, next) => {
//     try {
//       const orders = await OrderService.getAllOrders(req.query);
//       return res.status(200).json({ success: true, data: orders });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // GET /api/orders/:id
//   getOrderById: async (req, res, next) => {
//     try {
//       const order = await OrderService.getOrderById(req.params.id);
//       if (!order) {
//         return res.status(404).json({ success: false, message: 'Order not found' });
//       }
//       return res.status(200).json({ success: true, data: order });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // POST /api/orders
//   createOrder: async (req, res, next) => {
//     try {
//       let newOrder;

//       if (req.body.items || req.body.cartItems) {
//         // Validate first since these are NOT NULL in the DB.
//         if (!req.body.pickup_date || !req.body.pickup_time) {
//           return res.status(400).json({
//             success: false,
//             message: 'pickup_date and pickup_time are required',
//           });
//         }

//         const checkoutData = {
//           order_number: req.body.order_number,
//           customer_id: req.body.customer_id,
//           // These five must be passed through, otherwise OrderService.createOrderWithItems
//           // silently skips customer creation.
//           customer_name: req.body.customer_name,
//           customer_phone: req.body.customer_phone,
//           customer_alt_phone: req.body.customer_alt_phone,
//           customer_facebook: req.body.customer_facebook,
//           customer_email: req.body.customer_email,
//           placed_by_admin: req.body.placed_by_admin,
//           order_type: req.body.order_type || 'Pre-Order',
//           source: req.body.source || 'online',
//           status: req.body.status || 'Confirmed',
//           additional_charge: req.body.additional_charge || 0,
//           discount: req.body.discount || 0,
//           payment_type: req.body.payment_type || 'deposit',
//           amount_paid: req.body.amount_paid || 0,
//           pickup_date: req.body.pickup_date,
//           pickup_time: req.body.pickup_time,
//           special_instructions: req.body.special_instructions,
//           items: req.body.items || req.body.cartItems,
//         };

//         newOrder = await OrderService.createOrderWithItems(checkoutData);
//       } else {
//         newOrder = await OrderService.createOrder(req.body);
//       }

//       return res.status(201).json({ success: true, data: newOrder });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // PATCH /api/orders/:id/status
//   updateStatus: async (req, res, next) => {
//     try {
//       const orderId = req.params.id || req.body.id;
//       const { status } = req.body;

//       if (!orderId) {
//         return res.status(400).json({ success: false, message: 'orderId is required' });
//       }
//       if (!status) {
//         return res.status(400).json({ success: false, message: 'status is required' });
//       }

//       const updated = await OrderService.updateStatus(orderId, status); // ⚠️ see note below

//       return res.status(200).json({
//         success: true,
//         message: 'Order status updated successfully',
//         data: updated,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// module.exports = orderController;

const { OrderService } = require('../../src/services/orders.service');

// The payment_type column in the DB is an enum that (based on existing code)
// only accepts 'full' or 'deposit'. Frontends sometimes send a payment
// *method* instead (e.g. "cash", "gcash") which is not a valid enum value.
// Normalize whatever comes in to a safe enum value instead of erroring.
const PAYMENT_TYPE_ENUM = ['full', 'deposit'];
const PAYMENT_TYPE_ALIASES = {
  cash: 'full',
  gcash: 'full',
  card: 'full',
  paid: 'full',
  partial: 'deposit',
  downpayment: 'deposit',
  'down payment': 'deposit',
};

function normalizePaymentType(value) {
  if (PAYMENT_TYPE_ENUM.includes(value)) return value;
  const key = String(value || '').trim().toLowerCase();
  return PAYMENT_TYPE_ALIASES[key] || 'full';
}

const orderController = {
  // GET /api/orders
  // Frontend expects: { success: true, data: [...] }
  getAllOrders: async (req, res, next) => {
    try {
      const orders = await OrderService.getAllOrders(req.query);
      return res.status(200).json({ success: true, data: orders });
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
      return res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/orders
  createOrder: async (req, res, next) => {
    try {
      let newOrder;

      if (req.body.items || req.body.cartItems) {
        const orderType = req.body.order_type || 'Pre-Order';

        // pickup_date/pickup_time are only required from the client for
        // Pre-Order. For Buy Now, the DB columns are still NOT NULL, so we
        // default them to "now" instead of requiring the frontend to send them.
        if (orderType === 'Pre-Order' && (!req.body.pickup_date || !req.body.pickup_time)) {
          return res.status(400).json({
            success: false,
            message: 'pickup_date and pickup_time are required',
          });
        }

        const now = new Date();
        const defaultPickupDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const defaultPickupTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

        const checkoutData = {
          order_number: req.body.order_number,
          customer_id: req.body.customer_id,
          // These five must be passed through, otherwise OrderService.createOrderWithItems
          // silently skips customer creation.
          customer_name: req.body.customer_name,
          customer_phone: req.body.customer_phone,
          customer_alt_phone: req.body.customer_alt_phone,
          customer_facebook: req.body.customer_facebook,
          customer_email: req.body.customer_email,
          placed_by_admin: req.body.placed_by_admin,
          order_type: orderType,
          source: req.body.source || 'online',
          status: req.body.status || 'Confirmed',
          additional_charge: req.body.additional_charge || 0,
          discount: req.body.discount || 0,
          payment_type: normalizePaymentType(req.body.payment_type),
          amount_paid: req.body.amount_paid || 0,
          pickup_date: req.body.pickup_date || defaultPickupDate,
          pickup_time: req.body.pickup_time || defaultPickupTime,
          special_instructions: req.body.special_instructions,
          items: req.body.items || req.body.cartItems,
        };

        newOrder = await OrderService.createOrderWithItems(checkoutData);
      } else {
        newOrder = await OrderService.createOrder(req.body);
      }

      return res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/orders/:id/status
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

      const updated = await OrderService.updateStatus(orderId, status); // ⚠️ see note below

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = orderController;