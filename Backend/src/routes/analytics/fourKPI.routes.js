const router = require('express').Router();
const { FourKpiController } = require('../../../src/controller/analytics/fourKPI.controller');
const { authMiddlewareJwt } = require('../../../src/middleware/auth.middleware');

// Kukunin yung KPI data depende sa timeframe parameter (e.g., /api/four-kpi/today)
router.get('/:timeframe', authMiddlewareJwt, FourKpiController.getKpiByTimeframe);

module.exports = router;