const { ProductService } = require('../../services/product.service.js');
const { ok } = require('../../utils/response.js');

const ProductController = {
  getAll: async (req, res, next) => {
    try {
      const filters = {
        category: req.query.category,
        search: req.query.search,
        activeOnly: req.query.activeOnly !== 'false',
      };

      ok(res, await ProductService.getProducts(filters));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { ProductController };