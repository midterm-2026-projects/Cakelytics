const router = require('express').Router();
const { HeatmapController } = require('../../../src/controller/analytics/heatmap.controller');
const { authMiddlewareJwt } = require('../../../src/middleware/auth.middleware');

router.get('/:timeframe', authMiddlewareJwt, HeatmapController.getHeatmapData);

module.exports = router;