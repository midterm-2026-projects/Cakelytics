import { describe, it, expect } from "vitest";
import ProductService from "../../../src/services/orderingServices/product.service";

describe("Product Service", () => {
  let productId = null;

  it("should create a product", async () => {
    const product = await ProductService.createProduct({
      name: "Service Test Cake",
      category: "Pastry",
      price: 1200,

      inclusion: "Chocolate with filling",
      image_url: null,

      daily_limit: 5,

      is_active: true,

      allow_file_upload: false,
    });

    productId = product.id;

    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Service Test Cake");
    expect(product.category).toBe("Pastry");
    expect(Number(product.price)).toBe(1200);
    expect(product.is_active).toBe(true);
  });

  it("should get all products", async () => {
    const products = await ProductService.getProducts();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("should get product by id", async () => {
    const product = await ProductService.getProductById(productId);

    expect(product).toBeDefined();
    expect(product.id).toBe(productId);
  });

  it("should update a product", async () => {
    const updated = await ProductService.updateProduct(
      productId,
      {
        price: 1500,
        daily_limit: 15,
      }
    );

    expect(Number(updated.price)).toBe(1500);
    expect(updated.daily_limit).toBe(15);
  });

  it("should activate a product", async () => {
    await ProductService.updateProduct(productId, {
      is_active: false,
    });

    const activated =
      await ProductService.activateProduct(productId);

    expect(activated.is_active).toBe(true);
  });

  it("should deactivate a product", async () => {
    const deactivated =
      await ProductService.deactivateProduct(productId);

    expect(deactivated.is_active).toBe(false);
  });

  it("should delete a product", async () => {
    const deleted =
      await ProductService.deleteProduct(productId);

    expect(deleted.id).toBe(productId);
  });

  it("should throw an error when product id is missing", async () => {
    await expect(
      ProductService.getProductById()
    ).rejects.toThrow("Product ID is required.");
  });

  it("should reject invalid category", async () => {
    await expect(
      ProductService.createProduct({
        name: "Invalid Product",
        category: "Food",
        price: 100,
      })
    ).rejects.toThrow("Invalid product category.");
  });

  it("should reject negative price", async () => {
    await expect(
      ProductService.createProduct({
        name: "Negative Price",
        category: "Pastry",
        price: -500,
      })
    ).rejects.toThrow("Invalid product price.");
  });

  it("should reject empty product name", async () => {
    await expect(
      ProductService.createProduct({
        name: "",
        category: "Pastry",
        price: 100,
      })
    ).rejects.toThrow("Product name is required.");
  });
});