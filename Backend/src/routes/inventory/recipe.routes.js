const router = require('express').Router();
const { RecipeController } = require('../../controller/inventory/recipe.controller.js');

router.get('/', RecipeController.getAll);
router.get('/:id', RecipeController.getById);
router.post('/', RecipeController.create);
router.put('/:id', RecipeController.update);
router.delete('/:id', RecipeController.delete);

module.exports = router;