import { describe, it, expect } from "vitest";
import OrderModel from "../../../src/model/orderingModels/order.model";

describe("Order Model", () => {
  let orderId = null;

  it("should create an order", async () => {
    const order = await OrderModel.create({
      customer_id: null,
      placed_by_admin: false,
      order_type: "Pre-Order",
      source: "online",
      payment_type: "full",

      subtotal: 1000,
      additional_charge: 100,
      discount: 50,
      amount_paid: 500,

      pickup_date: "2026-07-15",
      pickup_time: "10:00:00",

      special_instructions: "Less sugar",
      customer_reference_url: null,
      paymongo_payment_id: null
    });

    orderId = order.id;

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.order_number).toContain("ORD-");
    expect(order.status).toBe("Confirmed");
    expect(Number(order.grand_total)).toBe(1050);
    expect(Number(order.balance)).toBe(550);
  });

  it("should return all orders", async () => {
    const orders = await OrderModel.findAll();

    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });

  it("should find an order by id", async () => {
    const order = await OrderModel.findById(orderId);

    expect(order).toBeDefined();
    expect(order.id).toBe(orderId);
  });

  it("should update an order", async () => {
    const updated = await OrderModel.update(orderId, {
      status: "Ready"
    });

    expect(updated.status).toBe("Ready");
  });

  it("should update order status", async () => {
    const updated = await OrderModel.updateStatus(
      orderId,
      "Completed"
    );

    expect(updated.status).toBe("Completed");
  });

  it("should delete an order", async () => {
    const deleted = await OrderModel.delete(orderId);

    expect(deleted.id).toBe(orderId);

    await expect(
      OrderModel.findById(orderId)
    ).rejects.toThrow();
  });
});