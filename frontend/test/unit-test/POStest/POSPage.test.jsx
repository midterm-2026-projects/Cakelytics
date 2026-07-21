import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import POSPage from "../../../src/pages/PosPage/POSPage";

global.alert = vi.fn();

const mockProducts = [
  {
    id: "1",
    name: "Package A",
    category: "Package",
    price: 1000,
    stock_quantity: 10,
    image_url: "",
  },
  {
    id: "2",
    name: "Package B",
    category: "Package",
    price: 1500,
    stock_quantity: 10,
    image_url: "",
  },
  {
    id: "3",
    name: "Croissant",
    category: "Pastry",
    price: 80,
    stock_quantity: 10,
    image_url: "",
  },
];

beforeEach(() => {
  vi.clearAllMocks();

  global.fetch = vi.fn((url) => {
    const urlStr = typeof url === "string" ? url : url?.url || "";

    // PRODUCTS - POSPage fetches from /api/products?...
    if (urlStr.includes("/api/products") || urlStr.includes("/products")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockProducts,
          }),
      });
    }

    // CHECKOUT - POSPage posts to /api/orders/checkout
    if (urlStr.includes("/orders/checkout") || urlStr.includes("/api/orders/checkout")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { order: { id: "order-1" }, sale: { id: "sale-1" } },
          }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

describe("POSPage", () => {
  it("renders products from API", async () => {
    render(<POSPage />);

    expect(await screen.findByText("Package A")).toBeInTheDocument();
    expect(screen.getByText("Package B")).toBeInTheDocument();
    expect(screen.getByText("Croissant")).toBeInTheDocument();
  });

  it("filters products using search", async () => {
    render(<POSPage />);

    await screen.findByText("Package A");

    const input = screen.getByPlaceholderText(/search product/i);

    fireEvent.change(input, {
      target: {
        value: "Package A",
      },
    });

    expect(screen.getByText("Package A")).toBeInTheDocument();
    expect(screen.queryByText("Package B")).not.toBeInTheDocument();
    expect(screen.queryByText("Croissant")).not.toBeInTheDocument();
  });

  it("prevents adding Package products in Order Now mode", async () => {
    render(<POSPage />);

    await screen.findByText("Package A");

    const addButtons = screen.getAllByRole("button", {
      name: /add/i,
    });

    fireEvent.click(addButtons[0]);

    expect(global.alert).toHaveBeenCalled();
  });

  it("adds a non-Package product to cart", async () => {
    render(<POSPage />);

    await screen.findByText("Croissant");

    // Find all ADD buttons and click the one for Croissant (Pastry - index 2)
    const addButtons = screen.getAllByRole("button", { name: /add/i });
    fireEvent.click(addButtons[2]);

    // Use getAllByText since "1 item" may appear in both sidebar and section headers
    const itemCounts = screen.getAllByText(/1 item/i);
    expect(itemCounts.length).toBeGreaterThanOrEqual(1);
  });

  it("switches to Pre-Order mode and shows customer fields", async () => {
    render(<POSPage />);

    await screen.findByText("Package A");

    fireEvent.click(
      screen.getByRole("button", {
        name: /pre-order/i,
      })
    );

    expect(
      screen.getByText(/customer details/i)
    ).toBeInTheDocument();
  });

  it("renders customer fields in Pre-Order", async () => {
    render(<POSPage />);

    await screen.findByText("Package A");

    fireEvent.click(
      screen.getByRole("button", {
        name: /pre-order/i,
      })
    );

    expect(
      screen.getByPlaceholderText(/customer name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/phone number/i)
    ).toBeInTheDocument();
  });

  it("changes category filter", async () => {
    render(<POSPage />);

    await screen.findByText("Package A");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Pastry",
      })
    );

    expect(screen.getByText("Croissant")).toBeInTheDocument();
    expect(screen.queryByText("Package A")).not.toBeInTheDocument();
  });

  it("opens Review Order modal when Complete Order is clicked", async () => {
    render(<POSPage />);

    // Wait for products to load
    await screen.findByText("Croissant");

    // Add a non-Package product (Croissant - Pastry)
    const addButtons = screen.getAllByRole("button", { name: /add/i });
    fireEvent.click(addButtons[2]);

    // Click Complete Order button
    const completeBtn = screen.getByRole("button", {
      name: /complete order/i,
    });
    fireEvent.click(completeBtn);

    // Review modal should appear
    expect(screen.getByText(/review order/i)).toBeInTheDocument();
    // Use getAllByText and check length since "Grand Total" appears in sidebar + modal
    const grandTotalElements = screen.getAllByText(/grand total/i);
    expect(grandTotalElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText(/enter cash amount/i)).toBeInTheDocument();
  });

  it("disables Finalize Transaction until sufficient cash is entered", async () => {
    render(<POSPage />);

    await screen.findByText("Croissant");

    // Add Croissant to cart
    const addButtons = screen.getAllByRole("button", { name: /add/i });
    fireEvent.click(addButtons[2]);

    // Open Review modal
    fireEvent.click(screen.getByRole("button", { name: /complete order/i }));

    // Finalize button should be disabled initially (cash = 0 < total = 80)
    const finalizeBtn = screen.getByRole("button", { name: /finalize transaction/i });
    expect(finalizeBtn).toBeDisabled();

    // Enter insufficient cash
    const cashInput = screen.getByPlaceholderText(/enter cash amount/i);
    fireEvent.change(cashInput, { target: { value: "50" } });
    expect(finalizeBtn).toBeDisabled();

    // Enter sufficient cash
    fireEvent.change(cashInput, { target: { value: "100" } });
    expect(finalizeBtn).not.toBeDisabled();
  });

  it("finalizes transaction and resets cart", async () => {
    render(<POSPage />);

    await screen.findByText("Croissant");

    // Add Croissant to cart
    const addButtons = screen.getAllByRole("button", { name: /add/i });
    fireEvent.click(addButtons[2]);

    // Open Review modal
    fireEvent.click(screen.getByRole("button", { name: /complete order/i }));

    // Enter sufficient cash
    const cashInput = screen.getByPlaceholderText(/enter cash amount/i);
    fireEvent.change(cashInput, { target: { value: "100" } });

    // Click finalize
    fireEvent.click(screen.getByRole("button", { name: /finalize transaction/i }));

    // Wait for async completion - modal should close
    await waitFor(() => {
      expect(screen.queryByText(/review order/i)).not.toBeInTheDocument();
    });

    // Cart should be empty
    expect(screen.getByText(/wala pang items/i)).toBeInTheDocument();
  });
});
