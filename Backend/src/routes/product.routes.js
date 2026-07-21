const router = require('express').Router();
const { ProductController } = require('../../src/controller/product.controller');

// == MITCH == //
// GET /api/inventory/products
// GET /api/inventory/products?category=Pastry
// GET /api/inventory/products?category=Package
// GET /api/inventory/products?category=Celebration%20Material
router.get('/', ProductController.getAllProducts);

// GET /api/inventory/products/22222222-2222-2222-2222-222222222222
router.get('/:id', ProductController.getProductById);

// POST /api/inventory/products
router.post('/', ProductController.createProduct);

// PUT /api/inventory/products/:id
router.put('/:id', ProductController.updateProduct);

// DELETE /api/inventory/products/:id
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;