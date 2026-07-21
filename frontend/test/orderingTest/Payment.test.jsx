//@vitest-environment jsdom

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

import Payment from "../../../src/pages/orderingPage/Payment";

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
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// --------------------

describe("Payment Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockNavigate.mockClear();

    window.alert = vi.fn();

    window.localStorage.setItem(
      "customerDetails",
      JSON.stringify({
        name: "Juan Dela Cruz",
        contact: "09123456789",
        orderType: "Pickup",
      })
    );
  });

  it("should renders payment page", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Payment",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("order-progress")
    ).toBeInTheDocument();
  });

  it("should displays customer information", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Juan Dela Cruz")
    ).toBeInTheDocument();

    expect(
      screen.getByText("09123456789")
    ).toBeInTheDocument();

    expect(
      screen.getByText((content, element) =>
        element?.textContent === "Order Type: Pickup"
      )
    ).toBeInTheDocument();
  });

  it("should selects Full Payment option", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    const fullRadio = screen.getByDisplayValue("full");

    fireEvent.click(fullRadio);

    expect(fullRadio).toBeChecked();
  });

  it("should places order successfully", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Place Order/i,
      })
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Order placed successfully!"
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/complete"
    );
  });

  it("should saves payment type to localStorage", () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByDisplayValue("full")
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Place Order/i,
      })
    );

    expect(
      window.localStorage.setItem
    ).toHaveBeenCalledWith(
      "paymentType",
      "full"
    );
  });

  it("should shows delivery address when order type is Delivery", () => {
    window.localStorage.setItem(
      "customerDetails",
      JSON.stringify({
        name: "Juan Dela Cruz",
        contact: "09123456789",
        orderType: "Delivery",
        address: "Manila City",
      })
    );

    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Manila City")
    ).toBeInTheDocument();
  });
});