
const { ProductModel } = require('../model/product.model');

function buildProductPayload(body) {
  return {
    name: body.name,
    category: body.category,
    price: body.price,
    // Frontend form field is "description" (Inclusion/Description textarea) -
    // maps directly to the "inclusion" column, which is the one that actually exists.
    inclusion: body.inclusion ?? body.description ?? '',
    image_url: body.image_url || null,
    daily_limit: body.daily_limit ?? 0,
    is_active: body.is_active !== false,
    allow_file_upload: body.allow_file_upload ?? false,
    stock_quantity: body.stock_quantity || 0,
  };
}

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
    const payload = buildProductPayload(body);
    const { data, error } = await ProductModel.create(payload);
    if (error) throw error;
    return data;
  },

  async updateProduct(id, body) {
    const payload = buildProductPayload(body);
    const { data, error } = await ProductModel.update(id, payload);
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { data, error } = await ProductModel.delete(id);
    if (error) throw error;

    if (!data) {
      const notFound = new Error(`Product not found for id=${id}`);
      notFound.status = 404;
      throw notFound;
    }
    return data;
  },
};

module.exports = { ProductService };
