
// const OrdersModelModule = require('../model/orders.model');
// const OrdersModel = OrdersModelModule.OrdersModel || OrdersModelModule;
// const OrderItemsModelModule = require('../model/orderItems.model');
// const OrderItemsModel = OrderItemsModelModule.OrderItemsModel || OrderItemsModelModule;
// const { SalesService } = require('../services/sales.service');



// function buildOrderNumber() {
//   return '';
// }

// function normalizeOrderType(type) {
//   const value = String(type || '').toLowerCase();
//   return value.includes('buy') || value.includes('now') ? 'Buy Now' : 'Pre-Order';
// }

// function normalizePaymentType(type) {
//   const value = String(type || '').toLowerCase();
//   return value === 'deposit' ? 'deposit' : 'full';
// }

// function normalizeStatus(status) {
//   const value = String(status || '').toLowerCase();
//   if (value === 'ready') return 'Ready';
//   if (value === 'completed') return 'Completed';
//   if (value === 'cancelled' || value === 'canceled') return 'Cancelled';
//   return 'Confirmed';
// }

// function isMissingOptionalTable(error) {
//   const message = String(error?.message || '').toLowerCase();
//   return (
//     message.includes('relation') && message.includes('does not exist')
//   ) || message.includes('could not find the table') || message.includes('schema cache');
// }

// const OrderService = {
//   // Pinag-isang listing method na may backward-compatible alias
//   async getAllOrders(filters = {}) {
//     // OrdersModel.findAll() already returns data array.
//     // Keep backward compatibility with older model implementations.
//     const result = await OrdersModel.findAll(filters);

//     if (Array.isArray(result)) return result;

//     // If model returns { data, error }
//     const maybeData = result?.data;
//     const maybeError = result?.error;
//     if (maybeError) throw maybeError;
//     return maybeData || [];
//   },

//   // Backward-compatible alias (no Supabase usage here)
//   // Some tests/older code may call getOrders instead of getAllOrders.
//   getOrders: async (query = {}) => OrderService.getAllOrders(query),

//   async getOrderById(id) {
//     const { data, error } = await OrdersModel.findById(id);
//     if (error) throw error;
//     return data;
//   },

//   async createOrder(body = {}) {
//     const subtotal = Number(body.subtotal || 0);
//     const additionalCharge = Number(body.additional_charge ?? body.additional_fee ?? 0);
//     const discount = Number(body.discount || 0);
//     const grandTotal = Number(body.grand_total ?? subtotal + additionalCharge - discount);
//     const amountPaid = Number(body.amount_paid ?? grandTotal);
//     const paymentType = normalizePaymentType(body.payment_type);

//     const payload = {
//       order_number: body.order_number || buildOrderNumber(),
//       customer_id: body.customer_id || null,
//       placed_by_admin: body.placed_by_admin || null,
//       pickup_date: body.pickup_date || null,
//       pickup_time: body.pickup_time || null,
//       payment_type: paymentType,
//       amount_paid: amountPaid,
//       balance: Math.max(0, grandTotal - amountPaid),
//       order_type: normalizeOrderType(body.order_type),
//       source: body.source || 'walk-in',
//       status: normalizeStatus(body.status),
//       subtotal,
//       additional_charge: additionalCharge,
//       discount,
//       grand_total: grandTotal,
//       special_instructions: body.special_instructions || '',
//       customer_reference_url: body.customer_reference_url || null,
//       paymongo_payment_id: body.paymongo_payment_id || null,
//     };

//     const { data, error } = await OrdersModel.create(payload);
//     if (error) throw error;
//     return {
//       ...data,
//       customer_name: body.customer_name || data?.customers?.name || null,
//       phone_number: body.phone_number || data?.customers?.phone || null,
//     };
//   },

//   async completeOrder(body = {}) {
//     const {
//       items,
//       payment_type,
//       amount_paid,

//       // NOTE: `change_due` is intentionally NOT handled for orders because the
//       // `orders` table schema (schema_para_sa_SPBS.sql) does not contain a
//       // `change_due` column.
//       //
//       // If you later add a migration for `orders.change_due`, we can safely
//       // re-enable passing it.

//       // Optional fields
//       status,
//       customer_name,
//       phone_number,
//       pickup_date,
//       pickup_time,
//       order_type,
//       subtotal,
//       additional_charge,
//       // Legacy key support
//       additional_fee,
//       discount,
//       grand_total,
//       order_number,
//       sale_number,
//     } = body || {};

//     if (!Array.isArray(items)) {
//       throw new Error('items must be an array');
//     }

//     const mappedAdditional = additional_charge ?? additional_fee ?? 0;
//     const subtotalValue = Number(
//       subtotal ?? items.reduce((sum, item) => {
//         const price = Number(item.unit_price ?? item.unitPrice ?? item.price ?? 0);
//         return sum + Number(item.quantity || 0) * price;
//       }, 0)
//     );
//     const grandTotalValue = Number(grand_total ?? subtotalValue + Number(mappedAdditional || 0) - Number(discount || 0));
//     const amountPaidValue = Number(amount_paid ?? grandTotalValue);

//     let customerId = body.customer_id || null;
//     if (!customerId && (customer_name || phone_number)) {
//       const { data: customer, error: customerError } = await OrdersModel.createCustomer({
//         name: customer_name || 'Walk-in',
//         phone: phone_number || 'N/A',
//       });
//       if (customerError) throw customerError;
//       customerId = customer?.id || null;
//     }

//     const order = await this.createOrder({
//       order_number,
//       customer_id: customerId,
//       customer_name,
//       phone_number,
//       pickup_date,
//       pickup_time,
//       payment_type,
//       amount_paid: amountPaidValue,
//       order_type,
//       status,
//       subtotal: subtotalValue,
//       additional_charge: mappedAdditional,
//       discount,
//       grand_total: grandTotalValue,
//     });

//     const orderItemsPayload = items.map((it) => ({
//       order_id: order.id,
//       product_id: it.product_id || it.productId || null,
//       product_name: it.product_name || it.productName || it.name,
//       quantity: it.quantity,
//       unit_price: it.unit_price ?? it.unitPrice ?? it.price,
//       total_price:
//         it.total_price ??
//         it.lineTotal ??
//         it.line_total ??
//         it.quantity * (it.unit_price ?? it.unitPrice ?? it.price),
//     }));

//     if (orderItemsPayload.length > 0) {
//       const { error } = await OrderItemsModel.createMany(orderItemsPayload);
//       if (error) throw error;
//     }

//     let sale = null;
//     try {
//       sale = await SalesService.createSale({
//         order_id: order.id,
//         payment_method: body.payment_method || payment_type || 'cash',
//         subtotal: subtotalValue,
//         additional_charge: mappedAdditional,
//         discount,
//         grand_total: grandTotalValue,
//         amount_paid: amountPaidValue,
//         // change_due: change_due ?? Math.max(0, amountPaidValue - grandTotalValue),
//         sale_number,
//         items: [],
//       });
//     } catch (error) {
//       if (!isMissingOptionalTable(error)) throw error;
//     }

//     return {
//       order,
//       sale,
//     };
//   },

//   async updateStatus(orderId, status) {
//     const normalized = String(status);

//     const { data, error } = await OrdersModel.updateStatus(orderId, normalized);
//     if (error) throw error;
//     return data;
//   },
// };

// module.exports = { OrderService };

// const OrdersModelModule = require('../model/orders.model');
// const OrdersModel = OrdersModelModule.OrdersModel || OrdersModelModule;
// const OrderItemsModelModule = require('../model/orderItems.model');
// const OrderItemsModel = OrderItemsModelModule.OrderItemsModel || OrderItemsModelModule;
// const { SalesService } = require('../services/sales.service');



// function buildOrderNumber() {
//   return '';
// }

// function normalizeOrderType(type) {
//   const value = String(type || '').toLowerCase();
//   return value.includes('buy') || value.includes('now') ? 'Buy Now' : 'Pre-Order';
// }

// function normalizePaymentType(type) {
//   const value = String(type || '').toLowerCase();
//   return value === 'deposit' ? 'deposit' : 'full';
// }

// function normalizeStatus(status) {
//   const value = String(status || '').toLowerCase();
//   if (value === 'ready') return 'Ready';
//   if (value === 'completed') return 'Completed';
//   if (value === 'cancelled' || value === 'canceled') return 'Cancelled';
//   return 'Confirmed';
// }

// function isMissingOptionalTable(error) {
//   const message = String(error?.message || '').toLowerCase();
//   return (
//     message.includes('relation') && message.includes('does not exist')
//   ) || message.includes('could not find the table') || message.includes('schema cache');
// }

// const OrderService = {
//   // Pinag-isang listing method na may backward-compatible alias
//   async getAllOrders(filters = {}) {
//     // OrdersModel.findAll() already returns data array.
//     // Keep backward compatibility with older model implementations.
//     const result = await OrdersModel.findAll(filters);

//     if (Array.isArray(result)) return result;

//     // If model returns { data, error }
//     const maybeData = result?.data;
//     const maybeError = result?.error;
//     if (maybeError) throw maybeError;
//     return maybeData || [];
//   },

//   // Backward-compatible alias (no Supabase usage here)
//   // Some tests/older code may call getOrders instead of getAllOrders.
//   getOrders: async (query = {}) => OrderService.getAllOrders(query),

//   async getOrderById(id) {
//     const { data, error } = await OrdersModel.findById(id);
//     if (error) throw error;
//     return data;
//   },

//   async createOrder(body = {}) {
//     const subtotal = Number(body.subtotal || 0);
//     const additionalCharge = Number(body.additional_charge ?? body.additional_fee ?? 0);
//     const discount = Number(body.discount || 0);
//     const grandTotal = Number(body.grand_total ?? subtotal + additionalCharge - discount);
//     const amountPaid = Number(body.amount_paid ?? grandTotal);
//     const paymentType = normalizePaymentType(body.payment_type);

//     const payload = {
//       order_number: body.order_number || buildOrderNumber(),
//       customer_id: body.customer_id || null,
//       placed_by_admin: body.placed_by_admin || null,
//       pickup_date: body.pickup_date || null,
//       pickup_time: body.pickup_time || null,
//       payment_type: paymentType,
//       amount_paid: amountPaid,
//       balance: Math.max(0, grandTotal - amountPaid),
//       order_type: normalizeOrderType(body.order_type),
//       source: body.source || 'walk-in',
//       status: normalizeStatus(body.status),
//       subtotal,
//       additional_charge: additionalCharge,
//       discount,
//       grand_total: grandTotal,
//       special_instructions: body.special_instructions || '',
//       customer_reference_url: body.customer_reference_url || null,
//       paymongo_payment_id: body.paymongo_payment_id || null,
//     };

//     const { data, error } = await OrdersModel.create(payload);
//     if (error) throw error;
//     return {
//       ...data,
//       customer_name: body.customer_name || data?.customers?.name || null,
//       phone_number: body.phone_number || data?.customers?.phone || null,
//     };
//   },

//   async completeOrder(body = {}) {
//     const {
//       items,
//       payment_type,
//       amount_paid,

//       // NOTE: `change_due` is intentionally NOT handled for orders because the
//       // `orders` table schema (schema_para_sa_SPBS.sql) does not contain a
//       // `change_due` column.
//       //
//       // If you later add a migration for `orders.change_due`, we can safely
//       // re-enable passing it.

//       // Optional fields
//       status,
//       customer_name,
//       phone_number,
//       pickup_date,
//       pickup_time,
//       order_type,
//       subtotal,
//       additional_charge,
//       // Legacy key support
//       additional_fee,
//       discount,
//       grand_total,
//       order_number,
//       sale_number,
//     } = body || {};

//     if (!Array.isArray(items)) {
//       throw new Error('items must be an array');
//     }

//     const mappedAdditional = additional_charge ?? additional_fee ?? 0;
//     const subtotalValue = Number(
//       subtotal ?? items.reduce((sum, item) => {
//         const price = Number(item.unit_price ?? item.unitPrice ?? item.price ?? 0);
//         return sum + Number(item.quantity || 0) * price;
//       }, 0)
//     );
//     const grandTotalValue = Number(grand_total ?? subtotalValue + Number(mappedAdditional || 0) - Number(discount || 0));
//     const amountPaidValue = Number(amount_paid ?? grandTotalValue);

//     let customerId = body.customer_id || null;
//     if (!customerId && (customer_name || phone_number)) {
//       const { data: customer, error: customerError } = await OrdersModel.createCustomer({
//         name: customer_name || 'Walk-in',
//         phone: phone_number || 'N/A',
//       });
//       if (customerError) throw customerError;
//       customerId = customer?.id || null;
//     }

//     const order = await this.createOrder({
//       order_number,
//       customer_id: customerId,
//       customer_name,
//       phone_number,
//       pickup_date,
//       pickup_time,
//       payment_type,
//       amount_paid: amountPaidValue,
//       order_type,
//       status,
//       subtotal: subtotalValue,
//       additional_charge: mappedAdditional,
//       discount,
//       grand_total: grandTotalValue,
//     });

//     const orderItemsPayload = items.map((it) => ({
//       order_id: order.id,
//       product_id: it.product_id || it.productId || null,
//       product_name: it.product_name || it.productName || it.name,
//       quantity: it.quantity,
//       unit_price: it.unit_price ?? it.unitPrice ?? it.price,
//       total_price:
//         it.total_price ??
//         it.lineTotal ??
//         it.line_total ??
//         it.quantity * (it.unit_price ?? it.unitPrice ?? it.price),
//     }));

//     if (orderItemsPayload.length > 0) {
//       const { error } = await OrderItemsModel.createMany(orderItemsPayload);
//       if (error) throw error;
//     }

//     let sale = null;
//     try {
//       sale = await SalesService.createSale({
//         order_id: order.id,
//         payment_method: body.payment_method || payment_type || 'cash',
//         subtotal: subtotalValue,
//         additional_charge: mappedAdditional,
//         discount,
//         grand_total: grandTotalValue,
//         amount_paid: amountPaidValue,
//         // change_due: change_due ?? Math.max(0, amountPaidValue - grandTotalValue),
//         sale_number,
//         items: [],
//       });
//     } catch (error) {
//       if (!isMissingOptionalTable(error)) throw error;
//     }

//     return {
//       order,
//       sale,
//     };
//   },

//   async updateStatus(orderId, status) {
//     const normalized = String(status);

//     const { data, error } = await OrdersModel.updateStatus(orderId, normalized);
//     if (error) throw error;
//     return data;
//   },
// };

// module.exports = { OrderService };

const { randomUUID } = require('crypto');

// ⚠️ CONFLICT: file 1 requires OrdersModel directly; file 2 unwraps { OrdersModel } OR raw export.
// Kept file 2's version since it's safe for either export style and won't break if
// orders.model.js changes its export shape later.
const OrdersModelModule = require('../model/orders.model');
const OrdersModel = OrdersModelModule.OrdersModel || OrdersModelModule;

const OrderItemsModelModule = require('../model/orderItems.model');
const OrderItemsModel = OrderItemsModelModule.OrderItemsModel || OrderItemsModelModule;

// ⚠️ CONFLICT: file 1 imports from './sales.service' (same folder),
// file 2 imports from '../services/sales.service' (parent folder). Only one of
// these paths is correct depending on where this file actually lives on disk.
// Kept file 2's path — VERIFY this against your actual folder structure.
const { SalesService } = require('../services/sales.service');

const { CustomerModel } = require('../model/customer.model'); // only used by file 1's createOrderWithItems

// ⚠️ CONFLICT: two different implementations, renamed to avoid collision.
function buildOrderNumber() {
  // file 1's version
  return `ORD-${Date.now()}`;
}

function buildOrderNumberV2() {
  // file 2's version
  return '';
}

// == file 2 only ==
function normalizeOrderType(type) {
  const value = String(type || '').toLowerCase();
  return value.includes('buy') || value.includes('now') ? 'Buy Now' : 'Pre-Order';
}

function normalizePaymentType(type) {
  const value = String(type || '').toLowerCase();
  return value === 'deposit' ? 'deposit' : 'full';
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'ready') return 'Ready';
  if (value === 'completed') return 'Completed';
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled';
  return 'Confirmed';
}

function isMissingOptionalTable(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    (message.includes('relation') && message.includes('does not exist')) ||
    message.includes('could not find the table') ||
    message.includes('schema cache')
  );
}

const OrderService = {
  // ⚠️ CONFLICT: file 1's getAllOrders assumes OrdersModel.findAll() always returns
  // { data, error }. File 2's version is defensive — handles findAll() returning either
  // a raw array OR { data, error }. Kept file 2's version as the canonical getAllOrders
  // since it's a strict superset of file 1's behavior (works with either model shape).
  async getAllOrders(filters = {}) {
    const result = await OrdersModel.findAll(filters);

    if (Array.isArray(result)) return result;

    const maybeData = result?.data;
    const maybeError = result?.error;
    if (maybeError) throw maybeError;
    return maybeData || [];
  },

  getOrders: async (query = {}) => OrderService.getAllOrders(query),

  async getOrderById(id) {
    const { data, error } = await OrdersModel.findById(id);
    if (error) throw error;
    return data;
  },

  // ⚠️ CONFLICT: file 1's simple createOrder — no field normalization,
  // used internally by file 1's completeOrder() and createOrderWithItems() flow.
  // Kept under the original name `createOrder`.
  async createOrder(body) {
    const payload = {
      order_number: body.order_number || buildOrderNumber(),
      customer_id: body.customer_id || null,
      order_type: body.order_type || 'Pre-Order',
      source: body.source || 'online',
      status: body.status || 'Confirmed',
      subtotal: body.subtotal || 0,
      additional_charge: body.additional_charge ?? body.additional_fee ?? 0,
      discount: body.discount || 0,
      grand_total: body.grand_total || 0,
      payment_type: body.payment_type || 'deposit',
      amount_paid: body.amount_paid || 0,
      balance: body.balance ?? (body.grand_total || 0) - (body.amount_paid || 0),
      pickup_date: body.pickup_date || null,
      pickup_time: body.pickup_time || null,
    };

    const { data, error } = await OrdersModel.create(payload);
    if (error) throw error;
    return data;
  },

  // ⚠️ CONFLICT: file 2's createOrder — normalizes order_type/payment_type/status,
  // computes balance/grand_total differently, adds paymongo_payment_id and
  // customer_reference_url fields, defaults source to 'walk-in' not 'online'.
  // THIS IS A DIFFERENT FUNCTION, renamed to createOrderNormalized so it doesn't
  // silently overwrite the one above. Decide which one your controller should call.
  async createOrderNormalized(body = {}) {
    const subtotal = Number(body.subtotal || 0);
    const additionalCharge = Number(body.additional_charge ?? body.additional_fee ?? 0);
    const discount = Number(body.discount || 0);
    const grandTotal = Number(body.grand_total ?? subtotal + additionalCharge - discount);
    const amountPaid = Number(body.amount_paid ?? grandTotal);
    const paymentType = normalizePaymentType(body.payment_type);

    const payload = {
      order_number: body.order_number || buildOrderNumberV2(),
      customer_id: body.customer_id || null,
      placed_by_admin: body.placed_by_admin || null,
      pickup_date: body.pickup_date || null,
      pickup_time: body.pickup_time || null,
      payment_type: paymentType,
      amount_paid: amountPaid,
      balance: Math.max(0, grandTotal - amountPaid),
      order_type: normalizeOrderType(body.order_type),
      source: body.source || 'walk-in',
      status: normalizeStatus(body.status),
      subtotal,
      additional_charge: additionalCharge,
      discount,
      grand_total: grandTotal,
      special_instructions: body.special_instructions || '',
      customer_reference_url: body.customer_reference_url || null,
      paymongo_payment_id: body.paymongo_payment_id || null,
    };

    const { data, error } = await OrdersModel.create(payload);
    if (error) throw error;
    return {
      ...data,
      customer_name: body.customer_name || data?.customers?.name || null,
      phone_number: body.phone_number || data?.customers?.phone || null,
    };
  },

  // ⚠️ CONFLICT: file 1's completeOrder — calls this.createOrder() (the simple version
  // above), uses OrderItemsModel field name `line_total`, no missing-table guard around
  // SalesService.createSale. Kept under the original name `completeOrder`.
  async completeOrder(body) {
    const {
      items,
      payment_type,
      amount_paid,
      change_due,
      status,
      customer_name,
      order_type,
      subtotal,
      additional_charge,
      additional_fee,
      discount,
      grand_total,
      order_number,
      sale_number,
    } = body || {};

    if (!Array.isArray(items)) {
      throw new Error('items must be an array');
    }

    const mappedAdditional = additional_charge ?? additional_fee ?? 0;

    const order = await this.createOrder({
      order_number,
      customer_name,
      order_type,
      status,
      subtotal,
      additional_charge: mappedAdditional,
      discount,
      grand_total,
    });

    const orderItemsPayload = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id || it.productId || null,
      product_name: it.product_name || it.productName || it.name,
      quantity: it.quantity,
      unit_price: it.unit_price ?? it.unitPrice ?? it.price,
      line_total:
        it.line_total ??
        it.lineTotal ??
        it.quantity * (it.unit_price ?? it.unitPrice ?? it.price),
    }));

    if (orderItemsPayload.length > 0) {
      const { error } = await OrderItemsModel.createMany(orderItemsPayload);
      if (error) throw error;
    }

    const sale = await SalesService.createSale({
      order_id: order.id,
      payment_method: payment_type,
      subtotal,
      additional_charge: mappedAdditional,
      discount,
      grand_total,
      amount_paid,
      change_due,
      sale_number,
      items: [],
    });

    return {
      order,
      sale,
    };
  },

  // ⚠️ CONFLICT: file 2's completeOrder — calls this.createOrder() but expects the
  // NORMALIZED version's fields (payment_type, amount_paid, pickup_date/time, phone_number,
  // auto-creates a walk-in customer via OrdersModel.createCustomer if none given), uses
  // `total_price` instead of `line_total`, and wraps SalesService.createSale in a
  // try/catch that swallows "missing table" errors. NOTE: as written this calls
  // `this.createOrder`, which in this merged file is file 1's simple version — if you
  // intend this to use the normalized field logic, change that call to
  // `this.createOrderNormalized` instead. Renamed to completeOrderV2 to avoid collision.
  async completeOrderV2(body = {}) {
    const {
      items,
      payment_type,
      amount_paid,
      status,
      customer_name,
      phone_number,
      pickup_date,
      pickup_time,
      order_type,
      subtotal,
      additional_charge,
      additional_fee,
      discount,
      grand_total,
      order_number,
      sale_number,
    } = body || {};

    if (!Array.isArray(items)) {
      throw new Error('items must be an array');
    }

    const mappedAdditional = additional_charge ?? additional_fee ?? 0;
    const subtotalValue = Number(
      subtotal ?? items.reduce((sum, item) => {
        const price = Number(item.unit_price ?? item.unitPrice ?? item.price ?? 0);
        return sum + Number(item.quantity || 0) * price;
      }, 0)
    );
    const grandTotalValue = Number(
      grand_total ?? subtotalValue + Number(mappedAdditional || 0) - Number(discount || 0)
    );
    const amountPaidValue = Number(amount_paid ?? grandTotalValue);

    let customerId = body.customer_id || null;
    if (!customerId && (customer_name || phone_number)) {
      const { data: customer, error: customerError } = await OrdersModel.createCustomer({
        name: customer_name || 'Walk-in',
        phone: phone_number || 'N/A',
      });
      if (customerError) throw customerError;
      customerId = customer?.id || null;
    }

    const order = await this.createOrderNormalized({
      order_number,
      customer_id: customerId,
      customer_name,
      phone_number,
      pickup_date,
      pickup_time,
      payment_type,
      amount_paid: amountPaidValue,
      order_type,
      status,
      subtotal: subtotalValue,
      additional_charge: mappedAdditional,
      discount,
      grand_total: grandTotalValue,
    });

    const orderItemsPayload = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id || it.productId || null,
      product_name: it.product_name || it.productName || it.name,
      quantity: it.quantity,
      unit_price: it.unit_price ?? it.unitPrice ?? it.price,
      total_price:
        it.total_price ??
        it.lineTotal ??
        it.line_total ??
        it.quantity * (it.unit_price ?? it.unitPrice ?? it.price),
    }));

    if (orderItemsPayload.length > 0) {
      const { error } = await OrderItemsModel.createMany(orderItemsPayload);
      if (error) throw error;
    }

    let sale = null;
    try {
      sale = await SalesService.createSale({
        order_id: order.id,
        payment_method: body.payment_method || payment_type || 'cash',
        subtotal: subtotalValue,
        additional_charge: mappedAdditional,
        discount,
        grand_total: grandTotalValue,
        amount_paid: amountPaidValue,
        sale_number,
        items: [],
      });
    } catch (error) {
      if (!isMissingOptionalTable(error)) throw error;
    }

    return {
      order,
      sale,
    };
  },

  // file 2 only — different name from file 1's OrderService.updateOrderStatus below,
  // so no collision, but note there are now TWO status-update entry points.
  async updateStatus(orderId, status) {
    const normalized = String(status);

    const { data, error } = await OrdersModel.updateStatus(orderId, normalized);
    if (error) throw error;
    return data;
  },
};

// =========================================================================
// MITCH (file 1 only)
// =========================================================================

OrderService.getCustomerOrders = async (customerId) => {
  const { data, error } = await OrdersModel.findByCustomer(customerId);
  if (error) throw error;
  return data;
};

OrderService.createOrderWithItems = async (body) => {
  let customerId = body.customer_id || null;

  if (!customerId && body.customer_name && body.customer_phone) {
    try {
      let existingCustomer = null;

      if (typeof CustomerModel.findByPhone === 'function') {
        const { data } = await CustomerModel.findByPhone(body.customer_phone);
        existingCustomer = data;
      } else if (typeof CustomerModel.findAll === 'function') {
        const { data } = await CustomerModel.findAll({
          phone: body.customer_phone,
        });

        if (data && data.length > 0) {
          existingCustomer = data[0];
        }
      }

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const newCustomerPayload = {
          name: body.customer_name,
          phone: body.customer_phone,
          alt_phone: body.customer_alt_phone || null,
          facebook: body.customer_facebook || null,
          email: body.customer_email || null,
        };

        const { data: createdCustomer, error: customerError } =
          await CustomerModel.create(newCustomerPayload);

        if (customerError) throw customerError;

        customerId = createdCustomer.id;
      }
    } catch (err) {
      console.error(
        'Failed to process customer registration during checkout:',
        err
      );
    }
  }

  const subtotal =
    body.items?.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    ) || 0;

  const grand_total =
    subtotal + (body.additional_charge || 0) - (body.discount || 0);

  const balance = grand_total - (body.amount_paid || 0);

  const orderPayload = {
    id: randomUUID(),
    order_number: body.order_number || `ORD-${Date.now().toString().slice(-6)}`,
    customer_id: customerId,
    placed_by_admin: body.placed_by_admin || null,
    order_type: body.order_type || 'Pre-Order',
    source: body.source || 'online',
    status: body.status || 'Confirmed',
    subtotal,
    additional_charge: body.additional_charge || 0,
    discount: body.discount || 0,
    grand_total,
    payment_type: body.payment_type || 'deposit',
    amount_paid: body.amount_paid || 0,
    balance,
    pickup_date: body.pickup_date || null,
    pickup_time: body.pickup_time || null,
    special_instructions: body.special_instructions || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const itemsPayload = (body.items || []).map((item) => ({
    id: randomUUID(),
    product_id: item.product_id,
    product_name: item.product_name,
    variant_label: item.variant_label || null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
  }));

  const { data, error } = await OrdersModel.createWithItems(
    orderPayload,
    itemsPayload
  );

  if (error) throw error;

  return data;
};

OrderService.updateOrderStatus = async (id, status) => {
  const { data, error } = await OrdersModel.updateStatus(id, status);
  if (error) throw error;
  return data;
};

module.exports = { OrderService };