import { describe, it, expect } from "vitest";
const OrderItem = require("../../../src/model/orderingModels/orderItem.model");

describe("OrderItem Model", () => {
  it("should create an order item", () => {
    const item = new OrderItem({
      order_id: "order-123",
      product_id: "product-123",
      product_name: "Chocolate Cake",
      variant_label: "6 inches",
      quantity: 2,
      unit_price: 500,
    });

    expect(item.id).toBeDefined();
    expect(item.product_name).toBe("Chocolate Cake");
    expect(item.quantity).toBe(2);
    expect(item.unit_price).toBe(500);
    expect(item.total_price).toBe(1000);
  });

  it("should calculate total price automatically", () => {
    const item = new OrderItem({
      product_name: "Cupcake",
      quantity: 3,
      unit_price: 120,
    });

    expect(item.total_price).toBe(360);
  });

  it("should validate required fields", () => {
    const item = new OrderItem({
      product_name: "Brownies",
      quantity: 1,
      unit_price: 150,
    });

    expect(item.validate()).toBe(true);
  });
});