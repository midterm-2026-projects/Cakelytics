const router = require('express').Router();
const { ProductionController } = require('../../controller/inventory/production.controller.js');

router.get('/', ProductionController.getAll);
router.post('/', ProductionController.confirmBatch);

module.exports = router;