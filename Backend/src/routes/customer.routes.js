// routes/customer.routes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller');

// GET /api/customers
router.get('/', customerController.getAllCustomers);

// 🔥 BAGONG ROUTE: GET /api/customers/verify?order_ref=ORD-512302&phone=09123456789
router.get('/verify', customerController.verifyCustomerAndOrder);

// GET /api/customers/c7a5c1a9-f1ce-4f48-afbb-c0bab8cf9e24
router.get('/:id', customerController.getCustomerById);

// POST /api/customers
router.post('/', customerController.createCustomer);

module.exports = router;