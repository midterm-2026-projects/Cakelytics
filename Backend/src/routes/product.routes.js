
// // const express = require('express');
// // const router = express.Router();

// // const { ProductController } = require('../controller/product.controller');

// // router.get('/', ProductController.getProducts);
// // router.get('/:id', ProductController.getProductById);
// // router.post('/', ProductController.createProduct);
// // router.put('/:id', ProductController.updateProduct);
// // router.patch('/:id', ProductController.updateProduct);
// // router.delete('/:id', ProductController.deleteProduct);

// // module.exports = router;

// const router = require('express').Router();
// const { ProductController } = require('../../controller/inventory/product.controller.js');

// // GET /api/inventory/products
// router.get('/', ProductController.getProducts);

// // GET /api/inventory/products/:id
// router.get('/:id', ProductController.getProductById);

// // POST /api/inventory/products
// router.post('/', ProductController.createProduct);

// // PUT /api/inventory/products/:id
// router.put('/:id', ProductController.updateProduct);

// // PATCH /api/inventory/products/:id
// router.patch('/:id', ProductController.updateProduct);

// // DELETE /api/inventory/products/:id
// router.delete('/:id', ProductController.deleteProduct);

// module.exports = router;

const router = require('express').Router();

const { ProductController } = require('../controller/product.controller.js');

// 2. Safe execution handlers
router.get('/', (req, res, next) => ProductController.getProducts(req, res, next));
router.get('/:id', (req, res, next) => ProductController.getProductById(req, res, next));
router.post('/', (req, res, next) => ProductController.createProduct(req, res, next));
router.put('/:id', (req, res, next) => ProductController.updateProduct(req, res, next));
router.patch('/:id', (req, res, next) => ProductController.updateProduct(req, res, next));
router.delete('/:id', (req, res, next) => ProductController.deleteProduct(req, res, next));

module.exports = router;