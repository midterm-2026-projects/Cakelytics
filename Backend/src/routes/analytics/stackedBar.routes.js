const router = require('express').Router();
const { StackedBarController } = require('../../../src/controller/analytics/stackedBar.controller');

// Kukunin yung Stacked Bar data depende sa timeframe parameter (e.g., /api/stacked-bar/monthly)
router.get('/:timeframe', authMiddlewareJwt, StackedBarController.getStackedBarByTimeframe);

module.exports = router;