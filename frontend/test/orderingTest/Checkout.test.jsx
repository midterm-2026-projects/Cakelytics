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
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// --------------------

describe("Checkout Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockNavigate.mockClear();

    window.alert = vi.fn();

    window.localStorage.setItem(
      "cart",
      JSON.stringify([
        {
          id: 1,
          name: "Chocolate Cake",
          price: 500,
          quantity: 2,
        },
      ])
    );
  });

  it("should renders checkout page", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Checkout/i)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("order-progress")
    ).toBeInTheDocument();
  });

  it("should shows cart items and total", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Chocolate Cake/)
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("₱1000.00")
    ).toHaveLength(3);
  });

  it("should shows preorder fields", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Pre-Order/i,
      })
    );

    expect(
      document.querySelector('input[type="date"]')
    ).toBeInTheDocument();

    expect(
      document.querySelector('input[type="time"]')
    ).toBeInTheDocument();
  });

  it("should validates required fields", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(/Place Order/i)
    );

    expect(window.alert).toHaveBeenCalled();
  });

  it("should places order successfully", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Full Name/i),
      {
        target: {
          value: "Juan Dela Cruz",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(/Contact Number/i),
      {
        target: {
          value: "09123456789",
        },
      }
    );

    fireEvent.click(
      screen.getByText(/Place Order/i)
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/receipt"
    );
  });

  it("should returns to menu", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(/Back to Menu/i)
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/menu"
    );
  });
});