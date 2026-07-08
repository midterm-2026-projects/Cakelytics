const router = require('express').Router();
const { MaterialController } = require('../../controller/inventory/material.controller.js');

router.get('/', MaterialController.getAll);
router.post('/', MaterialController.create);
router.put('/:id', MaterialController.update);
router.patch('/:id/restock', MaterialController.restock);
router.delete('/:id', MaterialController.delete);

module.exports = router;