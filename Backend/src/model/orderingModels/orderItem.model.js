const { TABLES, genId } = require("../../config/db");

class OrderItem {
  constructor(data) {
    this.id = data.id || genId();

    this.order_id = data.order_id || null;
    this.product_id = data.product_id || null;

    this.product_name = data.product_name;
    this.variant_label = data.variant_label || null;

    this.quantity = data.quantity;
    this.unit_price = Number(data.unit_price);
    this.total_price =
      data.total_price ??
      Number(data.quantity) * Number(data.unit_price);
  }

  validate() {
    if (!this.product_name) {
      throw new Error("Product name is required.");
    }

    if (
      this.quantity === undefined ||
      this.quantity === null ||
      this.quantity <= 0
    ) {
      throw new Error("Quantity must be greater than zero.");
    }

    if (
      this.unit_price === undefined ||
      this.unit_price === null ||
      this.unit_price < 0
    ) {
      throw new Error("Unit price must be zero or greater.");
    }

    if (
      this.total_price === undefined ||
      this.total_price === null ||
      this.total_price < 0
    ) {
      throw new Error("Total price must be zero or greater.");
    }

    return true;
  }

  toJSON() {
    return {
      id: this.id,
      order_id: this.order_id,
      product_id: this.product_id,
      product_name: this.product_name,
      variant_label: this.variant_label,
      quantity: this.quantity,
      unit_price: this.unit_price,
      total_price: this.total_price,
    };
  }

  static get table() {
    return "order_items";
  }
}

module.exports = OrderItem;