// const { OrderModel } = require('../../model/orderingModels/order.model');
// const { CustomerService } = require('./customer.service');
// const { OrderItemService } = require('./orderItem.service');

// function buildOrderPayload(body) {
//   return {
//     order_number: body.order_number || '',
//     customer_id: body.customer_id || null,
//     placed_by_admin: body.placed_by_admin || null,
//     order_type: body.order_type || 'Pre-Order',
//     source: body.source || 'walk-in',
//     status: body.status || 'Confirmed',
//     subtotal: Number(body.subtotal || 0),
//     additional_charge: Number(body.additional_charge || 0),
//     discount: Number(body.discount || 0),
//     grand_total: Number(body.grand_total || 0),
//     payment_type: body.payment_type || 'full',
//     amount_paid: Number(body.amount_paid || 0),
//     balance: Number(body.balance || 0),
//     pickup_date: body.pickup_date || null,
//     pickup_time: body.pickup_time || null,
//     special_instructions: body.special_instructions || '',
//     customer_reference_url: body.customer_reference_url || null,
//     paymongo_payment_id: body.paymongo_payment_id || null,
//   };
// }

// function buildOrderItemWithOrderId(item, orderId) {
//   return {
//     ...item,
//     order_id: orderId,
//   };
// }

// const OrderService = {
//   async getOrders(filters = {}) {
//     const { data, error } = await OrderModel.findAll(filters);
//     if (error) throw error;
//     return data;
//   },

//   async getOrderById(id) {
//     const { data, error } = await OrderModel.findById(id);
//     if (error) throw error;
//     return data;
//   },

//   async createOrder(body) {
//     const payload = buildOrderPayload(body);
//     const { data, error } = await OrderModel.create(payload);
//     if (error) throw error;
//     return data;
//   },

//   async createOrderWithItems(body) {
//     const customer = body.customer
//       ? await CustomerService.createCustomer(body.customer)
//       : null;

//     const order = await this.createOrder({
//       ...body,
//       customer_id: body.customer_id || customer?.id || null,
//     });

//     const items = body.items?.length
//       ? await OrderItemService.createOrderItems(
//         body.items.map((item) => buildOrderItemWithOrderId(item, order.id))
//       )
//       : [];

//     return {
//       ...order,
//       customer,
//       order_items: items,
//     };
//   },

//   async updateOrder(id, body) {
//     const payload = {};

//     if (body.order_number !== undefined) payload.order_number = body.order_number;
//     if (body.customer_id !== undefined) payload.customer_id = body.customer_id || null;
//     if (body.placed_by_admin !== undefined) payload.placed_by_admin = body.placed_by_admin || null;
//     if (body.order_type !== undefined) payload.order_type = body.order_type;
//     if (body.source !== undefined) payload.source = body.source;
//     if (body.status !== undefined) payload.status = body.status;
//     if (body.subtotal !== undefined) payload.subtotal = Number(body.subtotal);
//     if (body.additional_charge !== undefined) payload.additional_charge = Number(body.additional_charge);
//     if (body.discount !== undefined) payload.discount = Number(body.discount);
//     if (body.grand_total !== undefined) payload.grand_total = Number(body.grand_total);
//     if (body.payment_type !== undefined) payload.payment_type = body.payment_type;
//     if (body.amount_paid !== undefined) payload.amount_paid = Number(body.amount_paid);
//     if (body.balance !== undefined) payload.balance = Number(body.balance);
//     if (body.pickup_date !== undefined) payload.pickup_date = body.pickup_date || null;
//     if (body.pickup_time !== undefined) payload.pickup_time = body.pickup_time || null;
//     if (body.special_instructions !== undefined) payload.special_instructions = body.special_instructions || '';
//     if (body.customer_reference_url !== undefined) payload.customer_reference_url = body.customer_reference_url || null;
//     if (body.paymongo_payment_id !== undefined) payload.paymongo_payment_id = body.paymongo_payment_id || null;

//     const { data, error } = await OrderModel.update(id, payload);
//     if (error) throw error;
//     return data;
//   },

//   async updateOrderStatus(id, status) {
//     const { data, error } = await OrderModel.updateStatus(id, status);
//     if (error) throw error;
//     return data;
//   },

//   async deleteOrder(id) {
//     const { error } = await OrderModel.remove(id);
//     if (error) throw error;
//     return { id };
//   },
// };

// module.exports = { OrderService, buildOrderPayload };

const { OrderModel } = require('../../model/orderingModels/order.model');
const { CustomerService } = require('../../services/orderingServices/customer.service');
const { OrderItemService } = require('../../services/orderingServices/orderItem.service');

function buildOrderPayload(body) {
  return {
    order_number: body.order_number || '',
    customer_id: body.customer_id || null,
    placed_by_admin: body.placed_by_admin || null,
    order_type: body.order_type || 'Pre-Order',
    source: body.source || 'walk-in',
    status: body.status || 'Confirmed',
    subtotal: Number(body.subtotal || 0),
    additional_charge: Number(body.additional_charge || 0),
    discount: Number(body.discount || 0),
    grand_total: Number(body.grand_total || 0),
    payment_type: body.payment_type || 'full',
    amount_paid: Number(body.amount_paid || 0),
    balance: Number(body.balance || 0),
    pickup_date: body.pickup_date || null,
    pickup_time: body.pickup_time || null,
    special_instructions: body.special_instructions || '',
    customer_reference_url: body.customer_reference_url || null,
    paymongo_payment_id: body.paymongo_payment_id || null,
  };
}

function buildOrderItemWithOrderId(item, orderId) {
  return {
    ...item,
    order_id: orderId,
  };
}

const OrderService = {
  async getOrders(filters = {}) {
    const { data, error } = await OrderModel.findAll(filters);

    if (error) {
      throw error;
    }

    return data;
  },

  async getOrderById(id) {
    const { data, error } = await OrderModel.findById(id);

    if (error) {
      throw error;
    }

    return data;
  },

  async createOrder(body) {
    const payload = buildOrderPayload(body);

    const { data, error } = await OrderModel.create(payload);

    if (error) {
      throw error;
    }

    return data;
  },

  async createOrderWithItems(body) {
    const customer = body.customer
      ? await CustomerService.createCustomer(body.customer)
      : null;

    const order = await this.createOrder({
      ...body,
      customer_id: body.customer_id || customer?.id || null,
    });

    const items = body.items?.length
      ? await OrderItemService.createOrderItems(
          body.items.map((item) =>
            buildOrderItemWithOrderId(item, order.id)
          )
        )
      : [];

    return {
      ...order,
      customer,
      order_items: items,
    };
  },

  async updateOrder(id, body) {
    const payload = {};

    if (body.order_number !== undefined)
      payload.order_number = body.order_number;

    if (body.customer_id !== undefined)
      payload.customer_id = body.customer_id || null;

    if (body.placed_by_admin !== undefined)
      payload.placed_by_admin = body.placed_by_admin || null;

    if (body.order_type !== undefined)
      payload.order_type = body.order_type;

    if (body.source !== undefined)
      payload.source = body.source;

    if (body.status !== undefined)
      payload.status = body.status;

    if (body.subtotal !== undefined)
      payload.subtotal = Number(body.subtotal);

    if (body.additional_charge !== undefined)
      payload.additional_charge = Number(body.additional_charge);

    if (body.discount !== undefined)
      payload.discount = Number(body.discount);

    if (body.grand_total !== undefined)
      payload.grand_total = Number(body.grand_total);

    if (body.payment_type !== undefined)
      payload.payment_type = body.payment_type;

    if (body.amount_paid !== undefined)
      payload.amount_paid = Number(body.amount_paid);

    if (body.balance !== undefined)
      payload.balance = Number(body.balance);

    if (body.pickup_date !== undefined)
      payload.pickup_date = body.pickup_date || null;

    if (body.pickup_time !== undefined)
      payload.pickup_time = body.pickup_time || null;

    if (body.special_instructions !== undefined)
      payload.special_instructions = body.special_instructions || '';

    if (body.customer_reference_url !== undefined)
      payload.customer_reference_url = body.customer_reference_url || null;

    if (body.paymongo_payment_id !== undefined)
      payload.paymongo_payment_id = body.paymongo_payment_id || null;

    const { data, error } = await OrderModel.update(id, payload);

    if (error) {
      throw error;
    }

    return data;
  },

  async updateOrderStatus(id, status) {
    const { data, error } = await OrderModel.updateStatus(id, status);

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteOrder(id) {
    const { error } = await OrderModel.remove(id);

    if (error) {
      throw error;
    }

    return { id };
  },
};

module.exports = {
  OrderService,
  buildOrderPayload,
};