import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ProductCard } from "../../../src/components/ProductManagement/ProductCard";

describe("ProductCard Component", () => {
  const sampleProduct = {
    id: 1,
    name: "Classic Chocolate Cake",
    category: "PACKAGE",
    description: "Fudgy cake with rich frosting",
    price: 1500.5,
    limit: "Limit: 3/day",
    image: "https://example.com/cake.jpg"
  };

  it("should render product data and formats pricing cleanly into Philippine Peso", () => {
    render(<ProductCard product={sampleProduct} />);

    expect(screen.getByRole("heading", { name: "Classic Chocolate Cake" })).toBeInTheDocument();
    expect(screen.getByText("PACKAGE")).toBeInTheDocument();
    expect(screen.getByText("Limit: 3/day")).toBeInTheDocument();
    expect(screen.getByText("Fudgy cake with rich frosting")).toBeInTheDocument();
    
    // Verifies the formatted currency text match
    expect(screen.getByText("₱1,500.50")).toBeInTheDocument();
  });

  it("should hide the limit element banner when no limit constraint property is supplied", () => {
    const noLimitProduct = { ...sampleProduct, limit: undefined };
    render(<ProductCard product={noLimitProduct} />);

    expect(screen.queryByText(/limit:/i)).not.toBeInTheDocument();
  });

  it("should trigger onEdit and onDelete state callbacks with the product payload", async () => {
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <ProductCard 
        product={sampleProduct} 
        onEdit={onEditMock} 
        onDelete={onDeleteMock} 
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEditMock).toHaveBeenCalledWith(sampleProduct);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDeleteMock).toHaveBeenCalledWith(sampleProduct);
  });
});