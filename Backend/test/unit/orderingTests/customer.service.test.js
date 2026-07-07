import { describe, it, expect } from "vitest";
const customerService = require("../../../src/services/orderingServices/customer.service");

describe("Customer Service", () => {
  it("should create a customer", async () => {
    const customer = await customerService.create({
      name: "Test Customer",
      phone: "09171234567",
      email: "test@example.com",
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("Test Customer");
  });

  it("should get all customers", async () => {
    const customers = await customerService.getAll();

    expect(Array.isArray(customers)).toBe(true);
  });

  it("should update a customer", async () => {
    const customer = await customerService.create({
      name: "Old Name",
      phone: "09171234567",
    });

    const updated = await customerService.update(customer.id, {
      name: "New Name",
    });

    expect(updated.name).toBe("New Name");
  });

  it("should delete a customer", async () => {
    const customer = await customerService.create({
      name: "Delete Me",
      phone: "09998887777",
    });

    const result = await customerService.delete(customer.id);

    expect(result.message).toBe("Customer deleted successfully.");
  });
});