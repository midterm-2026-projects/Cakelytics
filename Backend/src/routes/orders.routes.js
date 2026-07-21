
// // routes/order.routes.js
// const express = require('express');
// const router = express.Router();
// const orderController = require('../controller/order.controller');

// // GET /api/orders
// router.get('/', orderController.getAllOrders);

// // POST /api/orders
// router.post('/', orderController.createOrderOnly);

// // POST /api/orders/checkout
// router.post('/checkout', orderController.checkout);

// module.exports = router;

// routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../../src/controller/order.controller');

// POST /api/orders/checkout
router.post('/checkout', orderController.createOrder); // ⚠️ see note 1

// GET /api/orders
// GET /api/orders?status=Pending
// GET /api/orders?search=ORD
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

// POST /api/orders
router.post('/', orderController.createOrder); // ⚠️ see note 2

// PATCH /api/orders/:id/status
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;