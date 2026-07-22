const { ProductService } = require('../services/product.service');

const ProductController = {
  // GET /api/products
  getProducts: async (req, res, next) => {
    try {
      const filters = {
        category: req.query.category,
        search: req.query.search,
        activeOnly: req.query.activeOnly !== 'false',
      };

      const products = await ProductService.getProducts(filters);
      return res.status(200).json({ success: true, data: products });
    } catch (err) {
      if (next) return next(err);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
      });
    }
  },

  getAllProducts: async (req, res, next) => {
    return ProductController.getProducts(req, res, next);
  },

  // GET /api/products/:id
  getProductById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, data: product });
    } catch (err) {
      if (err?.status === 404) {
        return res.status(404).json({
          success: false,
          message: err.message || 'Product not found',
        });
      }
      if (next) return next(err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
      });
    }
  },

  // POST /api/products
  createProduct: async (req, res, next) => {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      return res.status(201).json({ success: true, data: newProduct });
    } catch (err) {
      if (next) return next(err);
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || 'Bad Request',
      });
    }
  },

  // PUT /api/products/:id
  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.updateProduct(id, req.body);
      return res.status(200).json({ success: true, data: updatedProduct });
    } catch (err) {
      if (next) return next(err);
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || 'Bad Request',
      });
    }
  },

  // DELETE /api/products/:id
  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedProduct = await ProductService.deleteProduct(id);
      return res.status(200).json({ success: true, data: deletedProduct });
    } catch (err) {
      if (next) return next(err);
      return res.status(err.status || 400).json({
        success: false,
        message: err.message || 'Bad Request',
      });
    }
  },
};

module.exports = { ProductController };