const router = require('express').Router();
const { ProductController } = require('../../controller/inventory/product.controller.js');

router.get('/', ProductController.getAll);

module.exports = router;