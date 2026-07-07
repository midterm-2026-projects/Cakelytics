import { describe, it, expect } from "vitest";
const Customer = require("../../../src/model/orderingModels/customer.model");

describe("Customer Model", () => {
  it("should create a customer", () => {
    const customer = new Customer({
      name: "Juan Dela Cruz",
      phone: "09171234567",
    });

    expect(customer.name).toBe("Juan Dela Cruz");
    expect(customer.phone).toBe("09171234567");
    expect(customer.id).toBeDefined();
  });

  it("should validate required fields", () => {
    const customer = new Customer({
      name: "Maria",
      phone: "09998887777",
    });

    expect(customer.validate()).toBe(true);
  });

  it("should throw if name is missing", () => {
    expect(() => {
      new Customer({
        phone: "09123456789",
      }).validate();
    }).toThrow();
  });
});