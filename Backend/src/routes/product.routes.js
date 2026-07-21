const router = require('express').Router();
const { ProductController } = require('../../src/controller/product.controller');

// == MITCH == //
// GET /api/products
// GET /api/products?category=Pastry
// GET /api/products?category=Package
// GET /api/products?category=Celebration%20Material
router.get('/', ProductController.getAllProducts);

// GET /api/products/22222222-2222-2222-2222-222222222222
router.get('/:id', ProductController.getProductById);

// POST /api/products
router.post('/', ProductController.createProduct);

// PUT /api/products/:id
router.put('/:id', ProductController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;