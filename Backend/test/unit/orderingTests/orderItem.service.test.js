import { describe, it, expect } from "vitest";
const orderItemService = require("../../../src/services/orderingServices/orderItem.service");

describe("OrderItem Service", () => {
  it("should create an order item", async () => {
    const item = await orderItemService.create({
      product_name: "Test Cake",
      quantity: 2,
      unit_price: 450,
    });

    expect(item.id).toBeDefined();
    expect(item.product_name).toBe("Test Cake");
    expect(Number(item.total_price)).toBe(900);
  });

  it("should get all order items", async () => {
    const items = await orderItemService.getAll();

    expect(Array.isArray(items)).toBe(true);
  });

  it("should update an order item", async () => {
    const item = await orderItemService.create({
      product_name: "Update Test",
      quantity: 1,
      unit_price: 300,
    });

    const updated = await orderItemService.update(item.id, {
      quantity: 4,
      unit_price: 300,
    });

    expect(updated.quantity).toBe(4);
    expect(Number(updated.total_price)).toBe(1200);
  });

  it("should delete an order item", async () => {
    const item = await orderItemService.create({
      product_name: "Delete Test",
      quantity: 1,
      unit_price: 100,
    });

    const result = await orderItemService.delete(item.id);

    expect(result.message).toBe("Order item deleted successfully.");
  });
});