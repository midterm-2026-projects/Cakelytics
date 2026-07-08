// const { ProductModel } = require('../../model/orderingModels/product.model');

// function buildProductPayload(body) {
//   return {
//     name: body.name,
//     category: body.category,
//     price: Number(body.price || 0),
//     inclusion: body.inclusion || '',
//     image_url: body.image_url || null,
//     daily_limit: Number(body.daily_limit || 0),
//     is_active: body.is_active !== false,
//     allow_file_upload: body.allow_file_upload === true,
//   };
// }

// const ProductService = {
//   async getProducts(filters = {}) {
//     const { data, error } = await ProductModel.findAll(filters);
//     if (error) throw error;
//     return data;
//   },

//   async getProductById(id) {
//     const { data, error } = await ProductModel.findById(id);
//     if (error) throw error;
//     return data;
//   },

//   async createProduct(body) {
//     const { data, error } = await ProductModel.create(buildProductPayload(body));
//     if (error) throw error;
//     return data;
//   },

//   async updateProduct(id, body) {
//     const payload = {};

//     if (body.name !== undefined) payload.name = body.name;
//     if (body.category !== undefined) payload.category = body.category;
//     if (body.price !== undefined) payload.price = Number(body.price);
//     if (body.inclusion !== undefined) payload.inclusion = body.inclusion || '';
//     if (body.image_url !== undefined) payload.image_url = body.image_url || null;
//     if (body.daily_limit !== undefined) payload.daily_limit = Number(body.daily_limit);
//     if (body.is_active !== undefined) payload.is_active = body.is_active;
//     if (body.allow_file_upload !== undefined) payload.allow_file_upload = body.allow_file_upload;

//     const { data, error } = await ProductModel.update(id, payload);
//     if (error) throw error;
//     return data;
//   },

//   async deleteProduct(id) {
//     const { error } = await ProductModel.remove(id);
//     if (error) throw error;
//     return { id };
//   },
// };

// module.exports = { ProductService, buildProductPayload };

const { ProductModel } = require('../../model/orderingModels/product.model');

function buildProductPayload(body) {
  return {
    name: body.name,
    category: body.category,
    price: Number(body.price || 0),
    inclusion: body.inclusion || '',
    image_url: body.image_url || null,
    daily_limit: Number(body.daily_limit || 0),
    is_active: body.is_active !== false,
    allow_file_upload: body.allow_file_upload === true,
  };
}

const ProductService = {
  async getProducts(filters = {}) {
    const { data, error } = await ProductModel.findAll(filters);

    if (error) {
      throw error;
    }

    return data;
  },

  async getProductById(id) {
    const { data, error } = await ProductModel.findById(id);

    if (error) {
      throw error;
    }

    return data;
  },

  async createProduct(body) {
    const payload = buildProductPayload(body);

    const { data, error } = await ProductModel.create(payload);

    if (error) {
      throw error;
    }

    return data;
  },

  async updateProduct(id, body) {
    const payload = {};

    if (body.name !== undefined)
      payload.name = body.name;

    if (body.category !== undefined)
      payload.category = body.category;

    if (body.price !== undefined)
      payload.price = Number(body.price);

    if (body.inclusion !== undefined)
      payload.inclusion = body.inclusion || '';

    if (body.image_url !== undefined)
      payload.image_url = body.image_url || null;

    if (body.daily_limit !== undefined)
      payload.daily_limit = Number(body.daily_limit);

    if (body.is_active !== undefined)
      payload.is_active = body.is_active;

    if (body.allow_file_upload !== undefined)
      payload.allow_file_upload = body.allow_file_upload;

    const { data, error } = await ProductModel.update(id, payload);

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteProduct(id) {
    const { error } = await ProductModel.remove(id);

    if (error) {
      throw error;
    }

    return { id };
  },
};

module.exports = {
  ProductService,
  buildProductPayload,
};
