
// routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');

// GET /api/orders
router.get('/', orderController.getAllOrders);

// POST /api/orders
router.post('/', orderController.createOrderOnly);

// POST /api/orders/checkout
router.post('/checkout', orderController.checkout);

module.exports = router;
