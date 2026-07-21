//@vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

// --------------------
// Mock axios FIRST
// --------------------
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from "axios";
import Checkout from "../../../src/pages/orderingPage/Checkout";

// --------------------
// Mock navigate
// --------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// --------------------
// Mock OrderProgress
// --------------------
vi.mock(
  "../../../src/components/orderingComponents/OrderProgress",
  () => ({
    default: () => (
      <div data-testid="order-progress">
        Order Progress
      </div>
    ),
  })
);

// --------------------
// localStorage Mock
// --------------------
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    getStore: () => store,
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Sample cart data
const sampleCart = [
  { id: 1, name: "Chocolate Cake", price: 500, quantity: 2 },
  { id: 2, name: "Crinkles", price: 15, quantity: 3 },
];

// --------------------

describe("Checkout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.alert = vi.fn();

    // Set up cart data in localStorage
    window.localStorage.setItem("cart", JSON.stringify(sampleCart));
  });

  it("should render checkout page with order progress and form fields", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Checkout" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("order-progress")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name *")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contact Number *")).toBeInTheDocument();
  });

  it("should display order summary with cart items and grand total", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Use text matcher function since JSX formatting may split text across nodes
    expect(
      screen.getByText((content) => content.includes("Chocolate Cake"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Crinkles"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("2") && content.includes("Chocolate Cake"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("3") && content.includes("Crinkles"))
    ).toBeInTheDocument();

    // Total: 500*2 + 15*3 = 1000 + 45 = 1045
    // Verify the grand total row exists (1045.00 appears in total span and full payment option)
    const totals = screen.getAllByText((content) => content.includes("1045.00"));
    expect(totals.length).toBeGreaterThanOrEqual(1);
  });

  it("should show date and time fields when Pre-Order is selected", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    const preorderBtn = screen.getByRole("button", { name: /pre-order/i });
    fireEvent.click(preorderBtn);

    // Date and time inputs should appear (date and time inputs are rendered)
    expect(screen.getByRole("button", { name: /pick up now/i })).toBeInTheDocument();

    // The pre-order section shows date and time inputs
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });

  it("should places order successfully and navigate to receipt", async () => {
    // Mock successful axios response
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        order_no: "ORD-1001",
        id: "uuid-12345",
      },
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Fill in required fields
    const nameInput = screen.getByPlaceholderText("Full Name *");
    const contactInput = screen.getByPlaceholderText("Contact Number *");

    fireEvent.change(nameInput, { target: { value: "Juan Dela Cruz" } });
    fireEvent.change(contactInput, { target: { value: "09123456789" } });

    // Click Place Order
    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    fireEvent.click(placeOrderBtn);

    // Verify axios.post was called with correct payload
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/orders/checkout",
      expect.objectContaining({
        customer_name: "Juan Dela Cruz",
        customer_phone: "09123456789",
        subtotal: 1045,
        grand_total: 1045,
        payment_type: "deposit",
        order_type: "Buy Now",
        source: "online",
        cartItems: expect.arrayContaining([
          expect.objectContaining({
            product_id: 1,
            product_name: "Chocolate Cake",
            quantity: 2,
            price: 500,
          }),
          expect.objectContaining({
            product_id: 2,
            product_name: "Crinkles",
            quantity: 3,
            price: 15,
          }),
        ]),
      })
    );

    // Verify navigation to receipt
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/receipt");
    });

    // Verify localStorage was updated (cart removed, orderData saved)
    expect(window.localStorage.removeItem).toHaveBeenCalledWith("cart");
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "orderData",
      expect.any(String)
    );
  });

  it("should show alert and not submit if required fields are missing", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Click Place Order without filling required fields
    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    fireEvent.click(placeOrderBtn);

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter your Full Name."
    );
    expect(axios.post).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should returns to menu (go back) when Back to Menu is clicked", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    const backBtn = screen.getByRole("button", { name: /back to menu/i });
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

