import { describe, it, expect } from "vitest";
import OrderService from "../../../src/services/orderingServices/order.service";

describe("Order Service", () => {
  let orderId = null;

  it("should create an order", async () => {
    const order = await OrderService.createOrder({
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

      special_instructions: "Birthday order",
      customer_reference_url: null,
      paymongo_payment_id: null,
    });

    orderId = order.id;

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.order_number).toContain("ORD-");
    expect(order.status).toBe("Confirmed");
    expect(Number(order.grand_total)).toBe(1050);
    expect(Number(order.balance)).toBe(550);
  });

  it("should get all orders", async () => {
    const orders = await OrderService.getOrders();

    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);
  });

  it("should get order by id", async () => {
    const order = await OrderService.getOrderById(orderId);

    expect(order).toBeDefined();
    expect(order.id).toBe(orderId);
  });

  it("should update an order", async () => {
    const updated = await OrderService.updateOrder(orderId, {
      additional_charge: 200,
      discount: 100,
      subtotal: 1500,
      amount_paid: 700,
    });

    expect(Number(updated.subtotal)).toBe(1500);
    expect(Number(updated.grand_total)).toBe(1600);
    expect(Number(updated.balance)).toBe(900);
  });

  it("should update order status", async () => {
    const updated = await OrderService.updateOrderStatus(
      orderId,
      "Ready"
    );

    expect(updated.status).toBe("Ready");
  });

  it("should delete an order", async () => {
    const deleted = await OrderService.deleteOrder(orderId);

    expect(deleted.id).toBe(orderId);
  });

  it("should throw an error when order id is missing", async () => {
    await expect(
      OrderService.getOrderById()
    ).rejects.toThrow("Order ID is required.");
  });

  it("should throw an error for invalid status", async () => {
    await expect(
      OrderService.updateOrderStatus(
        orderId,
        "Invalid Status"
      )
    ).rejects.toThrow("Invalid order status.");
  });
});