const { ProductModel } = require('../model/product.model');

const ProductService = {
  async getProducts(filters) {
    const { data, error } = await ProductModel.findAll(filters);
    if (error) throw error;
    return data;
  },

  async getProductById(id) {
    const { data, error } = await ProductModel.findById(id);
    if (error) throw error;
    return data;
  },

  async createProduct(body) {
    const payload = {
      name: body.name,
      category: body.category,
      description: body.description || null,
      description_points: body.description_points || [],
      price: body.price,
      stock_quantity: body.stock_quantity || 0,
      stock_status: body.stock_status || 'Available',
      image_url: body.image_url || null,
      is_active: body.is_active !== false,
    };

    const { data, error } = await ProductModel.create(payload);
    if (error) throw error;
    return data;
  },
};

module.exports = { ProductService };
