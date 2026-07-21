import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, it, expect, vi } from "vitest";
import axios from "axios";
import Checkout from "../../../src/pages/orderingPage/Checkout";

// Mock window.alert
const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

// Clean In-Memory LocalStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Checkout Page Integration Test (No Component Mocks)", () => {
  beforeEach(() => {
    localStorage.clear();
    alertSpy.mockClear();
    vi.clearAllMocks();
  });

  const setupCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/checkout"]}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt" element={<div>Receipt Page Redirected</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render core structure, OrderProgress details, and compute summary correctly", () => {
    setupCart([
      { id: 1, name: "Chocolate Cake", price: 500, quantity: 2 },
      { id: 2, name: "Egg Tart", price: 50, quantity: 3 }
    ]);

    renderComponent();

    // Check OrderProgress steps rendered in Checkout component
    expect(screen.getByText("Details")).toBeInTheDocument();
    
    // Check form payment heading block
    expect(screen.getByRole("heading", { name: /^payment$/i })).toBeInTheDocument();

    // Text matching validation
    expect(screen.getByText((content) => content.replace(/\s+/g, "").includes("2×ChocolateCake"))).toBeInTheDocument();
    expect(screen.getByText((content) => content.replace(/\s+/g, "").includes("3×EggTart"))).toBeInTheDocument();

    // Grand Total and Deposit Calculations
    const totalElements = screen.getAllByText((content, element) => {
      const hasText = (node) => node.textContent.replace(/\s+/g, "").includes("₱1150.00");
      return hasText(element);
    });
    expect(totalElements.length).toBeGreaterThanOrEqual(1);

    const depositElements = screen.getAllByText((content, element) => {
      const hasText = (node) => node.textContent.replace(/\s+/g, "").includes("₱575.00");
      return hasText(element);
    });
    expect(depositElements.length).toBeGreaterThanOrEqual(1);
  });

  it("should block empty fields and trigger alert errors during custom form validation", async () => {
    setupCart([{ id: 1, name: "Chocolate Cake", price: 500, quantity: 1 }]);
    renderComponent();
    const user = userEvent.setup();

    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(placeOrderBtn);

    expect(alertSpy).toHaveBeenCalledWith("Please enter your Full Name.");
  });

  it("should display date and time fields dynamically when Pre-Order is selected", async () => {
    setupCart([{ id: 1, name: "Chocolate Cake", price: 500, quantity: 1 }]);
    const { container } = renderComponent();
    const user = userEvent.setup();

    // Date/Time input controls are initially absent
    expect(container.querySelector('input[type="date"]')).not.toBeInTheDocument();

    const preOrderBtn = screen.getByRole("button", { name: /pre-order/i });
    await user.click(preOrderBtn);

    // Verify presence after dynamic state update
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
  });

  it("should submit unified payload successfully and transition to receipt route", async () => {
    setupCart([{ id: 1, name: "Chocolate Cake", price: 500, quantity: 1 }]);
    
    const axiosPostSpy = vi.spyOn(axios, "post").mockResolvedValueOnce({
      data: { success: true, order_no: "ORD-2026-XYZ", message: "Order processed successfully!" }
    });

    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/full name \*/i), "Juan Dela Cruz");
    await user.type(screen.getByPlaceholderText(/contact number \*/i), "09123456789");

    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(placeOrderBtn);

    // Assert actual payload matches structural format mapping
    expect(axiosPostSpy).toHaveBeenCalledWith(
      "http://localhost:3000/api/orders/checkout",
      expect.objectContaining({
        customer_name: "Juan Dela Cruz",
        customer_phone: "09123456789",
        payment_type: "deposit",
        order_type: "Buy Now",
        grand_total: 500,
        cartItems: [
          expect.objectContaining({
            product_id: 1,
            product_name: "Chocolate Cake",
            quantity: 1,
            price: 500
          })
        ]
      })
    );

    // Storage updates and navigation triggers
    expect(localStorage.getItem("cart")).toBeNull();
    expect(JSON.parse(localStorage.getItem("orderData"))).toHaveProperty("success", true);
    expect(screen.getByText("Receipt Page Redirected")).toBeInTheDocument();
  });
});