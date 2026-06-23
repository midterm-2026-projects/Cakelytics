const crypto = require('crypto');

function genId() {
  return crypto.randomUUID();
}


const SCHEMA = {
  admins: ['id', 'name', 'email', 'created_at'],

  products: [
    'id', 'name', 'category', 'price', 'inclusion', 'image_url',
    'daily_limit', 'is_active', 'allow_file_upload', 'created_at', 'updated_at',
  ],
  product_variants: ['id', 'product_id', 'label', 'price'],
  product_date_exceptions: ['id', 'product_id', 'exception_date', 'reason'],

  customers: ['id', 'name', 'phone', 'alt_phone', 'facebook', 'email', 'created_at'],

  orders: [
    'id', 'order_number', 'customer_id', 'placed_by_admin', 'order_type', 'source',
    'status', 'subtotal', 'additional_charge', 'discount', 'grand_total',
    'payment_type', 'amount_paid', 'balance', 'pickup_date', 'pickup_time',
    'special_instructions', 'customer_reference_url', 'paymongo_payment_id',
    'created_at', 'updated_at',
  ],
  order_items: [
    'id', 'order_id', 'product_id', 'product_name', 'variant_label',
    'quantity', 'unit_price', 'total_price',
  ],

  raw_ingredients: [
    'id', 'name', 'unit', 'stock_quantity', 'minimum_stock', 'cost_per_unit', 'updated_at',
  ],
  celebration_materials: [
    'id', 'name', 'unit', 'stock_quantity', 'minimum_stock', 'cost_per_unit', 'updated_at',
  ],

  recipes: ['id', 'product_id', 'yield_quantity', 'yield_unit', 'estimated_cost', 'created_at', 'updated_at'],
  recipe_ingredients: ['id', 'recipe_id', 'item_type', 'item_name', 'quantity', 'unit'],

  production_logs: [
    'id', 'recipe_id', 'product_id', 'product_name', 'batches',
    'total_produced', 'yield_unit', 'notes', 'produced_at',
  ],
  production_deductions: ['id', 'production_log_id', 'item_type', 'item_name', 'quantity', 'unit'],

  waste_logs: [
    'id', 'waste_type', 'item_name', 'quantity', 'unit', 'reason', 'notes', 'cost', 'logged_at',
  ],

  analytics_cache: ['id', 'cache_key', 'payload', 'generated_at', 'expires_at'],
};

// Mirrors the SQL `create type ... as enum (...)` and category check constraint.
const ENUMS = {
  order_status: ['Confirmed', 'Ready', 'Completed', 'Cancelled'],
  order_type: ['Pre-Order', 'Buy Now'],
  order_source: ['online', 'walk-in'],
  payment_type: ['full', 'deposit'],
  waste_type: ['ingredient', 'material', 'product'],
  inv_item_type: ['raw', 'material'],
  product_category: ['Package', 'Pastry', 'Celebration Material'],
};

// ── SEED DATA ─────────────────────────────────────────────────────────

const now = () => new Date().toISOString();

const TABLES = {
  admins: [
    { id: genId(), name: 'Christine De Padua', email: 'admin@cakelytics.com', created_at: now() },
  ],

  products: [
    {
      id: genId(), name: 'Classic Vanilla Cake', category: 'Pastry', price: 850,
      inclusion: '1kg round cake', image_url: null, daily_limit: 5,
      is_active: true, allow_file_upload: false, created_at: now(), updated_at: now(),
    },
    {
      id: genId(), name: 'Birthday Package A', category: 'Package', price: 2500,
      inclusion: 'Cake + tarpaulin + balloons', image_url: null, daily_limit: 2,
      is_active: true, allow_file_upload: true, created_at: now(), updated_at: now(),
    },
  ],
  product_variants: [],
  product_date_exceptions: [],

  customers: [
    { id: genId(), name: 'Juan Dela Cruz', phone: '09171234567', alt_phone: '', facebook: 'juan.dc', email: 'juan@example.com', created_at: now() },
  ],

  orders: [],
  order_items: [],

  raw_ingredients: [
    { id: genId(), name: 'All-purpose flour', unit: 'kg', stock_quantity: 25, minimum_stock: 5, cost_per_unit: 55.0, updated_at: now() },
    { id: genId(), name: 'White sugar', unit: 'kg', stock_quantity: 18, minimum_stock: 4, cost_per_unit: 60.0, updated_at: now() },
    { id: genId(), name: 'Butter', unit: 'kg', stock_quantity: 10, minimum_stock: 2, cost_per_unit: 320.0, updated_at: now() },
  ],

  celebration_materials: [
    { id: genId(), name: 'Tarpaulin 2x3ft', unit: 'pc', stock_quantity: 12, minimum_stock: 3, cost_per_unit: 150.0, updated_at: now() },
    { id: genId(), name: 'Balloon set (12pcs)', unit: 'set', stock_quantity: 8, minimum_stock: 2, cost_per_unit: 90.0, updated_at: now() },
  ],

  recipes: [],
  recipe_ingredients: [],
  production_logs: [],
  production_deductions: [],
  waste_logs: [],
  analytics_cache: [],
};

module.exports = { SCHEMA, ENUMS, TABLES, genId };