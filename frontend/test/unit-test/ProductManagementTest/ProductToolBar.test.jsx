import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ProductToolbar } from "../../../src/components/ProductManagement/ProductToolBar";

describe("ProductToolbar Component", () => {
  it("binds search text value and dispatches custom state changes on inputs", async () => {
    const onSearchChangeMock = vi.fn();
    render(
      <ProductToolbar 
        search="" 
        onSearchChange={onSearchChangeMock} 
        activeFilter="All" 
      />
    );

    const input = screen.getByPlaceholderText(/search product.../i);
    expect(input).toHaveValue("");

    await userEvent.type(input, "Pastry");
    expect(onSearchChangeMock).toHaveBeenCalled();
  });

  it("applies the accurate highlighted styles on the matching selected filter button", () => {
    render(
      <ProductToolbar 
        search="" 
        onSearchChange={vi.fn()} 
        activeFilter="Pastry" 
      />
    );

    const activeBtn = screen.getByRole("button", { name: "Pastry" });
    const inactiveBtn = screen.getByRole("button", { name: "All" });

    expect(activeBtn).toHaveClass("bg-[#4A3530]", "text-white");
    expect(inactiveBtn).toHaveClass("bg-white", "text-[#8B6B64]");
  });

  it("should invoke filter assignment state update callbacks on selection shifts", async () => {
    const onFilterChangeMock = vi.fn();
    render(
      <ProductToolbar 
        search="" 
        onSearchChange={vi.fn()} 
        activeFilter="All" 
        onFilterChange={onFilterChangeMock} 
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Package" }));
    expect(onFilterChangeMock).toHaveBeenCalledWith("Package");
  });

  it("should call the creation action callback successfully when Add Product is triggered", async () => {
    const onAddProductMock = vi.fn();
    render(
      <ProductToolbar 
        search="" 
        onSearchChange={vi.fn()} 
        activeFilter="All" 
        onAddProduct={onAddProductMock} 
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /add product/i }));
    expect(onAddProductMock).toHaveBeenCalledTimes(1);
  });
});