const router = require('express').Router();
const { WasteController } = require('../../controller/inventory/waste.controller.js');

router.get('/', WasteController.getAll);
router.post('/', WasteController.log);

module.exports = router;