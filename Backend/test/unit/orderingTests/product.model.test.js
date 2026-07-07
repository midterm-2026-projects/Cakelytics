import { describe, it, expect } from "vitest";
import ProductModel from "../../../src/model/orderingModels/product.model";

describe("Product Model", () => {
  let productId = null;

  it("should create a product", async () => {
    const product = await ProductModel.create({
      name: "Vitest Chocolate Cake",
      category: "Pastry",
      price: 850,

      inclusion: "8 inches",
      image_url: null,

      daily_limit: 10,

      is_active: true,

      allow_file_upload: false,
    });

    productId = product.id;

    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Vitest Chocolate Cake");
    expect(product.category).toBe("Pastry");
    expect(Number(product.price)).toBe(850);
    expect(product.is_active).toBe(true);
  });

  it("should return all products", async () => {
    const products = await ProductModel.findAll();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("should find a product by id", async () => {
    const product = await ProductModel.findById(productId);

    expect(product).toBeDefined();
    expect(product.id).toBe(productId);
  });

  it("should update a product", async () => {
    const updated = await ProductModel.update(productId, {
      price: 950,
      daily_limit: 20,
    });

    expect(Number(updated.price)).toBe(950);
    expect(updated.daily_limit).toBe(20);
  });

  it("should activate a product", async () => {
    await ProductModel.update(productId, {
      is_active: false,
    });

    const activated = await ProductModel.activate(productId);

    expect(activated.is_active).toBe(true);
  });

  it("should deactivate a product", async () => {
    const deactivated = await ProductModel.deactivate(productId);

    expect(deactivated.is_active).toBe(false);
  });

  it("should delete a product", async () => {
    const deleted = await ProductModel.delete(productId);

    expect(deleted.id).toBe(productId);

    await expect(
      ProductModel.findById(productId)
    ).rejects.toThrow();
  });

  it("should reject an invalid category", async () => {
    await expect(
      ProductModel.create({
        name: "Invalid Product",
        category: "Invalid Category",
        price: 100,
      })
    ).rejects.toThrow("Invalid product category.");
  });

  it("should reject a negative price", async () => {
    await expect(
      ProductModel.create({
        name: "Negative Price",
        category: "Pastry",
        price: -100,
      })
    ).rejects.toThrow("Invalid product price.");
  });

  it("should reject an empty product name", async () => {
    await expect(
      ProductModel.create({
        name: "",
        category: "Pastry",
        price: 100,
      })
    ).rejects.toThrow("Product name is required.");
  });
});