
// const { ProductModel } = require('../model/product.model');

// function buildProductPayload(body) {
//   return {
//     name: body.name,
//     category: body.category,
//     price: body.price,
//     // Frontend form field is "description" (Inclusion/Description textarea) -
//     // maps directly to the "inclusion" column, which is the one that actually exists.
//     inclusion: body.inclusion ?? body.description ?? '',
//     image_url: body.image_url || null,
//     daily_limit: body.daily_limit ?? 0,
//     is_active: body.is_active !== false,
//     allow_file_upload: body.allow_file_upload ?? false,
//     stock_quantity: body.stock_quantity || 0,
//   };
// }

// const ProductService = {
//   async getProducts(filters) {
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
//     const payload = buildProductPayload(body);
//     const { data, error } = await ProductModel.create(payload);
//     if (error) throw error;
//     return data;
//   },

//   async updateProduct(id, body) {
//     const payload = buildProductPayload(body);
//     const { data, error } = await ProductModel.update(id, payload);
//     if (error) throw error;
//     return data;
//   },

//   async deleteProduct(id) {
//     const { data, error } = await ProductModel.delete(id);
//     if (error) throw error;

//     if (!data) {
//       const notFound = new Error(`Product not found for id=${id}`);
//       notFound.status = 404;
//       throw notFound;
//     }
//     return data;
//   },
// };

// module.exports = { ProductService };

// const { ProductModel } = require('../model/product.model');

// function buildProductPayload(body) {
//   return {
//     name: body.name,
//     category: body.category,
//     price: body.price,
//     // Frontend form field is "description" (Inclusion/Description textarea) -
//     // maps directly to the "inclusion" column, which is the one that actually exists.
//     inclusion: body.inclusion ?? body.description ?? '',
//     image_url: body.image_url || null,
//     daily_limit: body.daily_limit ?? 0,
//     is_active: body.is_active !== false,
//     allow_file_upload: body.allow_file_upload ?? false,
//     stock_quantity: body.stock_quantity || 0,
//   };
// }

// const ProductService = {
//   async getProducts(filters) {
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
//     const payload = buildProductPayload(body);
//     const { data, error } = await ProductModel.create(payload);
//     if (error) throw error;
//     return data;
//   },

//   async updateProduct(id, body) {
//     const payload = buildProductPayload(body);
//     const { data, error } = await ProductModel.update(id, payload);
//     if (error) throw error;
//     return data;
//   },

//   async deleteProduct(id) {
//     const { data, error } = await ProductModel.delete(id);
//     if (error) throw error;

//     if (!data) {
//       const notFound = new Error(`Product not found for id=${id}`);
//       notFound.status = 404;
//       throw notFound;
//     }
//     return data;
//   },
// };

// module.exports = { ProductService };

const { ProductModel } = require('../model/product.model');

// == file 2's helper ==
// ⚠️ CONFLICT: file 1 builds its create payload inline inside createProduct with a
// slightly different default set (daily_limit default 5, no `description` fallback).
// File 2 extracts a shared buildProductPayload() used by BOTH createProduct and
// updateProduct, defaults daily_limit to 0, and maps body.description as a fallback
// for inclusion. Kept as-is since collapsing them would change behavior silently.
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

  // ⚠️ RESOLVED CONFLICT: this used to be FILE 1's inline-payload version living under
  // the `createProduct` name, with FILE 2's buildProductPayload()-based version demoted
  // to `createProductV2`. Tests expect the buildProductPayload behavior under
  // `createProduct` (daily_limit default 0, `description` fallback for inclusion), so
  // that version is now canonical here. The old inline version is preserved below as
  // `createProductLegacy` in case any caller relies on its daily_limit=5 default.
  async createProduct(body) {
    const payload = buildProductPayload(body);
    const { data, error } = await ProductModel.create(payload);
    if (error) throw error;
    return data;
  },

  // Former FILE 1 `createProduct` — inline payload construction, daily_limit
  // defaults to 5 (not 0), no `description` fallback for inclusion. Kept available
  // under this name for any caller that wants those defaults.
  async createProductLegacy(payload) {
    const cleanPayload = {
      name: payload.name,
      category: payload.category,
      price: payload.price,

      // FIXED: description, description_points, stock_status removed —
      // these columns don't exist in the products table (see schema),
      // sending them causes "Could not find the 'X' column" errors.

      // FIXED: was `!== undefined ? payload.inclusion : ''`, which only
      // caught missing keys — an explicit `"inclusion": null` still slipped
      // through and violated the NOT NULL constraint. `||` catches null,
      // undefined, and '' alike, matching the DB's `default ''::text`.
      inclusion: payload.inclusion || '',

      image_url: payload.image_url !== undefined ? payload.image_url : null,
      daily_limit: payload.daily_limit !== undefined ? payload.daily_limit : 5,
      stock_quantity: payload.stock_quantity !== undefined ? payload.stock_quantity : 0,
      allow_file_upload: payload.allow_file_upload !== undefined ? payload.allow_file_upload : false,
      is_active: payload.is_active !== undefined ? payload.is_active : true,
    };

    const { data, error } = await ProductModel.create(cleanPayload);
    if (error) throw error;
    return data;
  },

  // ⚠️ CONFLICT: file 1's updateProduct — passes `body` straight through to
  // ProductModel.update with NO transformation (so a PATCH with just
  // { price: 99 } only touches price). Kept under the original name `updateProduct`.
  async updateProduct(id, body) {
    const { data, error } = await ProductModel.update(id, body);
    if (error) throw error;
    return data;
  },

  // ⚠️ CONFLICT: file 2's updateProduct — runs the update body through
  // buildProductPayload() first. This means a PARTIAL update (e.g. just changing
  // price) would overwrite every other field with its buildProductPayload default
  // (e.g. wipe out an existing image_url to null, reset is_active, etc.) unless the
  // caller sends the full object every time. Renamed to updateProductV2 — flagging
  // this because it's the riskier of the two for partial-update use cases like your
  // PATCH /:id route.
  async updateProductV2(id, body) {
    const payload = buildProductPayload(body);
    const { data, error } = await ProductModel.update(id, payload);
    if (error) throw error;
    return data;
  },

  // ⚠️ CONFLICT: file 1's deleteProduct — no not-found check, just returns whatever
  // ProductModel.delete resolves to. Kept under the original name `deleteProduct`.
  // Note: this may now be redundant with the 404/403 handling already added inside
  // ProductModel.delete itself in the model file we merged earlier — that model already
  // throws on not-found, so `error` here would carry that thrown error either way.
  async deleteProduct(id) {
    const { data, error } = await ProductModel.delete(id);
    if (error) throw error;
    return data;
  },

  // ⚠️ CONFLICT: file 2's deleteProduct — adds an explicit `if (!data) throw 404`
  // check on top of the error check. Renamed to deleteProductV2 to avoid collision.
  async deleteProductV2(id) {
    const { data, error } = await ProductModel.delete(id);
    if (error) throw error;

    if (!data) {
      const notFound = new Error(`Product not found for id=${id}`);
      notFound.status = 404;
      throw notFound;
    }
    return data;
  },

  // == MITCH == // (file 1 only)
  async checkProductLimit(productId) {
    const { data, error } = await ProductModel.getDailyLimit(productId);
    if (error) throw error;
    return data?.daily_limit > 0;
  },
};

module.exports = { ProductService };