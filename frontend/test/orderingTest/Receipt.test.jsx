//@vitest-environment jsdom

import React from "react";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

// --------------------
// Mock html-to-image FIRST
// --------------------
vi.mock("html-to-image", () => ({
  toPng: vi.fn(() =>
    Promise.resolve("data:image/png;base64,mock")
  ),
}));

import { toPng } from "html-to-image";
import Receipt from "../../src/pages/orderingPage/Receipt";

// --------------------
// Mock Navigate
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
  "../../src/components/orderingComponents/OrderProgress",
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
// Preserve createElement
// --------------------
const originalCreateElement =
  document.createElement.bind(document);

describe("Receipt Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.localStorage.clear();

    window.alert = vi.fn();

    mockNavigate.mockClear();

    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "a") {
        return {
          click: vi.fn(),
          set href(value) {},
          set download(value) {},
        };
      }

      return originalCreateElement(tag);
    });

    window.localStorage.setItem(
      "orderData",
      JSON.stringify({
        orderNumber: "ORD-1001",
        dateCreated: "07/01/2026",
        name: "Juan Dela Cruz",
        contact: "09123456789",
        paymentType: "deposit",
        total: 1000,
        deposit: 500,
        items: [
          {
            id: 1,
            name: "Chocolate Cake",
            qty: 2,
            price: 500,
          },
        ],
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render receipt", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Order Placed!")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("order-progress")
    ).toBeInTheDocument();
  });

  it("should display order information", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("ORD-1001")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Juan Dela Cruz")
    ).toBeInTheDocument();

    expect(
      screen.getByText("09123456789")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Chocolate Cake/i)
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("₱1000.00").length
    ).toBeGreaterThan(0);

    expect(
      screen.getByText("50% Deposit")
    ).toBeInTheDocument();

    expect(
      screen.getByText("₱500.00")
    ).toBeInTheDocument();
  });

  it("should save receipt image", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    fireEvent.click(
      await screen.findByRole("button", {
        name: /save receipt as image/i,
      })
    );

    await waitFor(() => {
      expect(toPng).toHaveBeenCalled();
    });
  });

  it("should not leave if receipt is not saved", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    fireEvent.click(
      await screen.findByRole("button", {
        name: /back to home/i,
      })
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Please save your receipt before leaving."
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate home after saving receipt", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    fireEvent.click(
      await screen.findByRole("button", {
        name: /save receipt as image/i,
      })
    );

    await waitFor(() => {
      expect(toPng).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /back to home/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should show loading when no order exists", () => {
    window.localStorage.clear();

    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading receipt/i)
    ).toBeInTheDocument();
  });
});