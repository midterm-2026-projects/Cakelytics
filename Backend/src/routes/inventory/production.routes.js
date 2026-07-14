const router = require('express').Router();
const { ProductionController } = require('../../controller/inventory/production.controller.js');

router.get('/', ProductionController.getAll);
router.post('/', ProductionController.confirmBatch);
router.get('/shopping-list', ProductionController.getShoppingList);

module.exports = router;