// routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');

router.post('/checkout', orderController.createOrder);

// GET /api/orders
// GET /api/orders?status=Pending
// GET /api/orders?search=ORD
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

// POST /api/orders
router.post('/', orderController.createOrder);

// PATCH /api/orders/:id/status
router.patch('/:id/status', orderController.updateStatus);

module.exports = router;