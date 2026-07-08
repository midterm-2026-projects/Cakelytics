const router = require('express').Router();
const { TopProductsController } = require('../../../src/controller/analytics/topProducts.controller');
const { authMiddlewareJwt } = require('../../../src/middleware/auth.middleware');

router.get('/:timeframe', authMiddlewareJwt, TopProductsController.getTopProducts);

module.exports = router;