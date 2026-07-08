const router = require('express').Router();
const { IngredientController } = require('../../controller/inventory/ingredient.controller.js');

router.get('/', IngredientController.getAll);
router.post('/', IngredientController.create);
router.put('/:id', IngredientController.update);
router.patch('/:id/restock', IngredientController.restock);
router.delete('/:id', IngredientController.delete);

module.exports = router;