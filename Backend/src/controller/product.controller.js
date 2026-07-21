// =============================================================================
// Week 6 — Day 1: System Integration Testing and Bug Fixing
// Feature: Inventory Integration Verification (Product Controller)
// -----------------------------------------------------------------------------
// HTTP request handlers for product CRUD:
//   • getProducts / getProductById — retrieve products with search/filter
//   • createProduct — add new product to inventory
//   • updateProduct — modify existing product details
//   • deleteProduct — remove product from inventory
// =============================================================================

const { ProductService } = require('../services/product.service');

const ProductController = {
  getProducts: async (req, res, next) => {
    try {
      const data = await ProductService.getProducts(req.query);
      res.status(200).json({ success: true, data });
    } catch (err) {
      if (next) return next(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const data = await ProductService.getProductById(req.params.id);
      // Service/model should either return a row or throw.
      if (!data) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, data });
    } catch (err) {
      // If service throws {status:404}, preserve it so frontend receives 404 instead of 500.
      if (err?.status === 404) {
        return res.status(404).json({ success: false, message: err.message || 'Product not found' });
      }
      if (next) return next(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/products
  createProduct: async (req, res, next) => {
    try {
      const data = await ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      if (next) return next(err);
      res.status(err.status || 500).json({ success: false, message: err.message });
    }
  },

  // PUT /api/products/:id
  updateProduct: async (req, res, next) => {
    try {
      const data = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (err) {
      if (next) return next(err);
      res.status(err.status || 500).json({ success: false, message: err.message });
    }
  },

  // DELETE /api/products/:id
  deleteProduct: async (req, res, next) => {
    try {
      const data = await ProductService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      if (next) return next(err);
      res.status(err.status || 500).json({ success: false, message: err.message });
    }
  },
};

module.exports = { ProductController };
