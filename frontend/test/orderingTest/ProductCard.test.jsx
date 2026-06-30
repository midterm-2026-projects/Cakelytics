// import { render, screen } from "@testing-library/react";
// import { describe, it, expect } from "vitest";
// import ProductCard from "../components/ProductCard";

// const mockProduct = {
//   id: 1,
//   name: "Chocolate Cake",
//   category: "Cake",
//   price: 100,
//   stock: "Available",
// };

// describe("ProductCard", () => {
//   it("should render product name", () => {
//     render(<ProductCard product={mockProduct} addToCart={() => {}} />);

//     expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
//   });

//   it("should render price", () => {
//     render(<ProductCard product={mockProduct} addToCart={() => {}} />);

//     expect(screen.getByText("₱100.00")).toBeInTheDocument();
//   });

//   it("should render category", () => {
//     render(<ProductCard product={mockProduct} addToCart={() => {}} />);

//     expect(screen.getByText("Cake")).toBeInTheDocument();
//   });

//   it("should render add to cart button", () => {
//     render(<ProductCard product={mockProduct} addToCart={() => {}} />);

//     expect(
//       screen.getByRole("button", { name: /add to cart/i })
//     ).toBeInTheDocument();
//   });
// });

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
// Adjust this path if your file layout differs
import ProductCard from "../../src/components/orderingComponents/ProductCard"; 

describe("ProductCard Component", () => {
  // Mock product data for standard available item
  const mockProduct = {
    id: 1,
    name: "Chocolate Fudge Cake",
    category: "Cakes",
    price: 850,
    image: "/chocolate-fudge.jpg",
    stock: "Available",
  };

  it("should render the product details accurately", () => {
    const mockAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} addToCart={mockAddToCart} />);

    // Verify imagery and textual product traits
    expect(screen.getByAltText("Chocolate Fudge Cake")).toHaveAttribute("src", "/chocolate-fudge.jpg");
    expect(screen.getByRole("heading", { name: "Chocolate Fudge Cake", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("Cakes")).toBeInTheDocument();
    expect(screen.getByText("₱850.00")).toBeInTheDocument();
    expect(screen.getByText("Available")).toHaveClass("text-green-600");
  });

  it("should trigger the addToCart function when the button is clicked", () => {
    const mockAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} addToCart={mockAddToCart} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    expect(addToCartBtn).not.toBeDisabled();
    
    // Simulate user click behavior
    fireEvent.click(addToCartBtn);

    // Verify spy function intercept parameters
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it("should disable the button and show Out of Stock when the product is not available", () => {
    const mockAddToCart = vi.fn();
    const outOfStockProduct = {
      ...mockProduct,
      stock: "Out of Stock",
    };

    render(<ProductCard product={outOfStockProduct} addToCart={mockAddToCart} />);

    // 1. Target the button specifically by its ARIA role
    const addToCartBtn = screen.getByRole("button", { name: /out of stock/i });
    expect(addToCartBtn).toBeDisabled();

    // 2. Target the status text element by matching the text inside a paragraph selector
    const statusText = screen.getByText("Out of Stock", { selector: "p" });
    expect(statusText).toHaveClass("text-red-500");

    // 3. Verify interaction remains completely blocked
    fireEvent.click(addToCartBtn);
    expect(mockAddToCart).not.toHaveBeenCalled();
  });
});