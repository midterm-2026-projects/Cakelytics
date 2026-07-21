
let { SalesModel, OrderTransactionModel } = require('../model/sales.model');

function buildSaleNumber() {
  return `SALE-${Date.now()}`;
}

const SalesService = {
  async getSales(limit) {
    const { data, error } = await SalesModel.findAll(limit);
    if (error) throw error;
    return data;
  },

  async createSale(body) {
    const payload = {
      order_id: body.order_id || null,
      sale_number: body.sale_number || buildSaleNumber(),
      subtotal: body.subtotal || 0,
      additional_charge: body.additional_charge ?? body.additional_fee ?? 0,
      discount: body.discount || 0,
      grand_total: body.grand_total || 0,
      payment_method: body.payment_method || 'cash',
      amount_paid: body.amount_paid || 0,
      change_due: body.change_due || 0,
    };

    const { data: sale, error } = await SalesModel.create(payload);
    if (error) throw error;

    if (body.items && body.items.length > 0) {
      const transactions = body.items.map((item) => ({
        order_id: body.order_id || null,
        sale_id: sale.id,
        product_id: item.product_id || null,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: transactionError } = await OrderTransactionModel.createMany(transactions);
      if (transactionError) throw transactionError;
    }

    return sale;
  },
};

function setSalesModels(models) {
  SalesModel = models.SalesModel || SalesModel;
  OrderTransactionModel = models.OrderTransactionModel || OrderTransactionModel;
}


module.exports = { SalesService, setSalesModels };
