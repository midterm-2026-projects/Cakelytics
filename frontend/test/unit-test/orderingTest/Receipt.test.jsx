//@vitest-environment jsdom

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

import Receipt from "../../../src/pages/orderingPage/Receipt";

describe("Receipt Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.alert = vi.fn();
    mockNavigate.mockClear();

    window.localStorage.setItem(
      "orderData",
      JSON.stringify({
        name: "Juan Dela Cruz",
        contact: "09123456789",
        paymentType: "deposit",
        subtotal: 1000,
        order_number: "ORD-1001",
        cartItems: [
          {
            id: 1,
            name: "Chocolate Cake",
            quantity: 2,
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
  });

  it("should display order information", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    await screen.findByText("Order Placed!");

    // ORD-1001 appears in order number and dbId
    const orderNos = screen.getAllByText((content) => content.includes("ORD-1001"));
    expect(orderNos.length).toBeGreaterThanOrEqual(1);

    // Customer info rendered with uppercase CSS class
    expect(
      screen.getByText((content) => content.includes("Juan Dela Cruz"))
    ).toBeInTheDocument();

    expect(
      screen.getByText((content) => content.includes("09123456789"))
    ).toBeInTheDocument();

    // Items rendered (split text: "2 × Chocolate Cake")
    expect(
      screen.getByText((content) => content.includes("Chocolate Cake"))
    ).toBeInTheDocument();

    // Total amount
    const totals = screen.getAllByText((content) => content.includes("1000.00"));
    expect(totals.length).toBeGreaterThanOrEqual(1);

    // Payment type
    expect(
      screen.getByText(/50% Deposit/i)
    ).toBeInTheDocument();
  });

  it("should download receipt and unlock navigation buttons", async () => {
    // Mock URL.createObjectURL to prevent actual blob URL creation
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    await screen.findByText("Order Placed!");

    const downloadBtn = screen.getByRole("button", { name: /download/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to home/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /back to home/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should not allow navigation before saving receipt", async () => {
    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    await screen.findByText("Order Placed!");

    expect(screen.getByRole("button", { name: /order again/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /back to home/i })).toBeDisabled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to menu after saving receipt", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    await screen.findByText("Order Placed!");

    fireEvent.click(screen.getByRole("button", { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /order again/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /order again/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/menu");
  });

  it("should show receipt even when no order exists (defaults)", async () => {
    window.localStorage.clear();

    render(
      <MemoryRouter>
        <Receipt />
      </MemoryRouter>
    );

    expect(await screen.findByText("Order Placed!")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("No item summary"))
      ).toBeInTheDocument();
    });
  });
});

