const ProductModel = require("../../model/orderingModels/product.model");

const ProductService = {
  // ==========================
  // Get All Products
  // ==========================
  async getProducts() {
    return await ProductModel.findAll();
  },

  // ==========================
  // Get Product By ID
  // ==========================
  async getProductById(id) {
    if (!id) {
      throw new Error("Product ID is required.");
    }

    return await ProductModel.findById(id);
  },

  // ==========================
  // Create Product
  // ==========================
  async createProduct(productData) {
    return await ProductModel.create(productData);
  },

  // ==========================
  // Update Product
  // ==========================
  async updateProduct(id, updates) {
    if (!id) {
      throw new Error("Product ID is required.");
    }

    return await ProductModel.update(id, updates);
  },

  // ==========================
  // Activate Product
  // ==========================
  async activateProduct(id) {
    if (!id) {
      throw new Error("Product ID is required.");
    }

    return await ProductModel.activate(id);
  },

  // ==========================
  // Deactivate Product
  // ==========================
  async deactivateProduct(id) {
    if (!id) {
      throw new Error("Product ID is required.");
    }

    return await ProductModel.deactivate(id);
  },

  // ==========================
  // Delete Product
  // ==========================
  async deleteProduct(id) {
    if (!id) {
      throw new Error("Product ID is required.");
    }

    return await ProductModel.delete(id);
  }
};

module.exports = ProductService;