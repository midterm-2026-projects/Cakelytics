
const OrdersModelModule = require('../model/orders.model');
const OrdersModel = OrdersModelModule.OrdersModel || OrdersModelModule;
const OrderItemsModelModule = require('../model/orderItems.model');
const OrderItemsModel = OrderItemsModelModule.OrderItemsModel || OrderItemsModelModule;
const { SalesService } = require('../services/sales.service');



function buildOrderNumber() {
  return '';
}

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
    message.includes('relation') && message.includes('does not exist')
  ) || message.includes('could not find the table') || message.includes('schema cache');
}

const OrderService = {
  // Pinag-isang listing method na may backward-compatible alias
  async getAllOrders(filters = {}) {
    // OrdersModel.findAll() already returns data array.
    // Keep backward compatibility with older model implementations.
    const result = await OrdersModel.findAll(filters);

    if (Array.isArray(result)) return result;

    // If model returns { data, error }
    const maybeData = result?.data;
    const maybeError = result?.error;
    if (maybeError) throw maybeError;
    return maybeData || [];
  },

  // Backward-compatible alias (no Supabase usage here)
  // Some tests/older code may call getOrders instead of getAllOrders.
  getOrders: async (query = {}) => OrderService.getAllOrders(query),

  async getOrderById(id) {
    const { data, error } = await OrdersModel.findById(id);
    if (error) throw error;
    return data;
  },

  async createOrder(body = {}) {
    const subtotal = Number(body.subtotal || 0);
    const additionalCharge = Number(body.additional_charge ?? body.additional_fee ?? 0);
    const discount = Number(body.discount || 0);
    const grandTotal = Number(body.grand_total ?? subtotal + additionalCharge - discount);
    const amountPaid = Number(body.amount_paid ?? grandTotal);
    const paymentType = normalizePaymentType(body.payment_type);

    const payload = {
      order_number: body.order_number || buildOrderNumber(),
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

  async completeOrder(body = {}) {
    const {
      items,
      payment_type,
      amount_paid,

      // NOTE: `change_due` is intentionally NOT handled for orders because the
      // `orders` table schema (schema_para_sa_SPBS.sql) does not contain a
      // `change_due` column.
      //
      // If you later add a migration for `orders.change_due`, we can safely
      // re-enable passing it.

      // Optional fields
      status,
      customer_name,
      phone_number,
      pickup_date,
      pickup_time,
      order_type,
      subtotal,
      additional_charge,
      // Legacy key support
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
    const grandTotalValue = Number(grand_total ?? subtotalValue + Number(mappedAdditional || 0) - Number(discount || 0));
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

    const order = await this.createOrder({
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
        // change_due: change_due ?? Math.max(0, amountPaidValue - grandTotalValue),
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

  async updateStatus(orderId, status) {
    const normalized = String(status);

    const { data, error } = await OrdersModel.updateStatus(orderId, normalized);
    if (error) throw error;
    return data;
  },
};

module.exports = { OrderService };
