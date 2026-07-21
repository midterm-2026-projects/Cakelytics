//@vitest-environment jsdom

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Checkout from "../../../src/pages/orderingPage/Checkout";
import axios from "axios";

// 1. I-mock ang Axios global instance
vi.mock("axios");

// 2. I-mock ang useNavigate mula sa react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 3. I-mock ang OrderProgress sub-component para hindi sumabog ang test sa mga assets nito
vi.mock("../../components/orderingComponents/OrderProgress", () => ({
  default: () => <div data-testid="order-progress">Order Progress</div>,
}));

describe("Checkout Component", () => {
  const mockCart = [
    {
      id: "prod-123",
      name: "Chocolate Cake",
      price: 500,
      quantity: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // I-mock ang window.alert para sa validation triggers
    vi.spyOn(window, "alert").mockImplementation(() => {});

    // I-setup ang malinis na Mock para sa LocalStorage
    const localStorageMock = (() => {
      let store = {
        cart: JSON.stringify(mockCart),
      };
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: vi.fn((key) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  it("should render checkout page", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name *")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contact Number *")).toBeInTheDocument();
    expect(screen.getByText("Pick up Now")).toBeInTheDocument();
    expect(screen.getByText("Pre-Order")).toBeInTheDocument();
  });

  it("should show cart items and total", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Hinahanap ang pangalan ng item sa cart
    expect(screen.getByText(/Chocolate Cake/i)).toBeInTheDocument();

    // Tiyaking nandoon ang label na Grand Total
    expect(screen.getByText("Grand Total")).toBeInTheDocument();

    // Dahil higit sa isa ang "₱1000.00" sa DOM, gumamit ng getAllByText at i-verify ang haba nito
    const totalElements = screen.getAllByText("₱1000.00");
    expect(totalElements.length).toBeGreaterThan(0); 
    expect(totalElements[0]).toBeInTheDocument();
  });

  it("should show preorder fields when Pre-Order is clicked", () => {
    const { container } = render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Siguraduhing nakatago ang date/time elements sa pickup mode (default)
    expect(container.querySelector('input[type="date"]')).not.toBeInTheDocument();
    expect(container.querySelector('input[type="time"]')).not.toBeInTheDocument();

    // I-trigger ang pag-click sa Pre-Order button
    const preorderButton = screen.getByText("Pre-Order");
    fireEvent.click(preorderButton);

    // Dapat lumabas na ang date at time fields sa DOM
    expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
  });

  it("should validate required fields", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    const placeOrderButton = screen.getByText("Place Order");
    fireEvent.click(placeOrderButton);

    // Unang field validation error: Name required
    expect(window.alert).toHaveBeenCalledWith("Please enter your Full Name.");
  });

  it("should place order successfully", async () => {
    // I-mock ang matagumpay na tugon mula sa iyong API
    axios.post.mockResolvedValueOnce({
      data: { success: true },
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    // Sagutan ang mga kailangang input data fields
    fireEvent.change(screen.getByPlaceholderText("Full Name *"), {
      target: { value: "Juan Dela Cruz" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contact Number *"), {
      target: { value: "09123456789" },
    });

    // Pindutin ang submit/place order order flow trigger
    const placeOrderButton = screen.getByText("Place Order");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      // Tiyaking tinawag ang tamang API endpoint ng backend server mo
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/orders/checkout",
        expect.objectContaining({
          customer_name: "Juan Dela Cruz",
          customer_phone: "09123456789",
          grand_total: 1000,
        })
      );

      // Tiyaking nilinis ang cart sa storage at nilipat ang user sa render view ng resibo
      expect(window.localStorage.removeItem).toHaveBeenCalledWith("cart");
      expect(mockNavigate).toHaveBeenCalledWith("/receipt");
    });
  });
});