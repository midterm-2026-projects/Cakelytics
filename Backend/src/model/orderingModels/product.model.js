<<<<<<< HEAD
const { supabase } = require('../../config/supabase');

const PRODUCT_SELECT = `
  *,
  product_variants(*),
  product_date_exceptions(*)
`;

const ProductModel = {
  async findAll(filters = {}) {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .order('name', { ascending: true });

    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.activeOnly !== false) {
      query = query.eq('is_active', true);
    }

    return query;
  },

  async findById(id) {
    return supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .single();
  },

  async create(payload) {
    return supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
  },

  async update(id, payload) {
    return supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return supabase
      .from('products')
      .delete()
      .eq('id', id);
  },
};

module.exports = { ProductModel };
=======
const crypto = require("crypto");
const { supabase } = require("../../config/supabase");

class Product {
  // ==========================
  // Validation
  // ==========================
  static validate(data) {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Product name is required.");
    }

    const validCategories = [
      "Package",
      "Pastry",
      "Celebration Material",
    ];

    if (!validCategories.includes(data.category)) {
      throw new Error("Invalid product category.");
    }

    if (
      typeof data.price !== "number" ||
      data.price < 0
    ) {
      throw new Error("Invalid product price.");
    }

    if (
      data.daily_limit !== undefined &&
      data.daily_limit < 0
    ) {
      throw new Error("Daily limit cannot be negative.");
    }

    return true;
  }

  // ==========================
  // Create
  // ==========================
  static async create(data) {
    Product.validate(data);

    const payload = {
      id: crypto.randomUUID(),

      name: data.name,

      category: data.category,

      price: data.price,

      inclusion: data.inclusion || null,

      image_url: data.image_url || null,

      daily_limit: data.daily_limit ?? 5,

      is_active: data.is_active ?? true,

      allow_file_upload:
        data.allow_file_upload ?? false,
    };

    const { data: product, error } =
      await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return product;
  }

  // ==========================
  // Read All
  // ==========================
  static async findAll() {
    const { data, error } =
      await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // ==========================
  // Read By ID
  // ==========================
  static async findById(id) {
    const { data, error } =
      await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // ==========================
  // Update
  // ==========================
  static async update(id, updates) {
    if (
      updates.category &&
      ![
        "Package",
        "Pastry",
        "Celebration Material",
      ].includes(updates.category)
    ) {
      throw new Error(
        "Invalid product category."
      );
    }

    if (
      updates.price !== undefined &&
      updates.price < 0
    ) {
      throw new Error(
        "Invalid product price."
      );
    }

    updates.updated_at =
      new Date().toISOString();

    const { data, error } =
      await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // ==========================
  // Activate Product
  // ==========================
  static async activate(id) {
    return await Product.update(id, {
      is_active: true,
    });
  }

  // ==========================
  // Deactivate Product
  // ==========================
  static async deactivate(id) {
    return await Product.update(id, {
      is_active: false,
    });
  }

  // ==========================
  // Delete
  // ==========================
  static async delete(id) {
    const existing =
      await Product.findById(id);

    const { error } =
      await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return existing;
  }
}

module.exports = Product;
>>>>>>> 7d687d6e60bd3be3ddf78accceb552bd685c9263
