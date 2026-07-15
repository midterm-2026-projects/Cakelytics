import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import Receipt from "../../../src/pages/orderingPage/Receipt";

// 1. Vitest Mocking - Dito natin sinasabihan ang Vite na huwag nang hanapin ang totoong "html2canvas" library
vi.mock("html2canvas", () => {
  return {
    default: vi.fn().mockResolvedValue({
      toDataURL: () => "data:image/png;base64,mockDataUrl"
    })
  };
});

// Robust LocalStorage Mocking
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });

describe("Receipt Page Integration Test", () => {
  const storageKey = "orderData"; 

  // Structured with fields matching Receipt.jsx's fallback parsing logic
  const mockOrderData = {
    order_no: "ORD-998877",
    name: "Juan Dela Cruz",
    contact: "09151234567",
    subtotal: 1000,
    payment_type: "deposit",
    cartItems: [ // Standard camelCase key na hahanapin sa system natin
      { id: 1, name: "Chocolate Cake", quantity: 1, price: 850 },
      { id: 2, name: "Crinkles", quantity: 10, price: 15 }
    ]
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/receipt"]}>
        <Routes>
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/" element={<div>Home View Screen</div>} />
          <Route path="/menu" element={<div>Menu View Screen</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should show a loading message when order data is empty or not yet resolved", () => {
    renderComponent();
    
    expect(screen.getByText("Order Placed!")).toBeInTheDocument();
    expect(screen.getByText("No item summary details available.")).toBeInTheDocument();
  });

  it("should parse order details from localStorage and mount values cleanly onto the template wrapper", async () => {
    localStorage.setItem(storageKey, JSON.stringify(mockOrderData));
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("ORD-998877")).toBeInTheDocument();
    });

    expect(screen.getByText("Order Placed!")).toBeInTheDocument();
    expect(screen.getByText("Aileen Cake Max")).toBeInTheDocument();
    expect(screen.getByText(/Juan Dela Cruz/i)).toBeInTheDocument();
    expect(screen.getByText("09151234567")).toBeInTheDocument();
    
    // Check that fallback message is gone and items are rendered with correct values
    expect(screen.queryByText("No item summary details available.")).not.toBeInTheDocument();
    expect(screen.getByText("1× Chocolate Cake")).toBeInTheDocument();
    expect(screen.getByText("₱850.00")).toBeInTheDocument();
  });

  it("should trigger browser file download utilities when saving image asset", async () => {
    localStorage.setItem(storageKey, JSON.stringify(mockOrderData));
    renderComponent();
    const user = userEvent.setup();

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    // Matches the exact text name in Receipt.jsx button
    const saveBtn = screen.getByRole("button", { name: /Download E-Receipt File/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
    });
    
    clickSpy.mockRestore();
  });

  it("should block navigation options if receipt state is not yet saved", () => {
    localStorage.setItem(storageKey, JSON.stringify(mockOrderData));
    renderComponent();

    const goHomeBtn = screen.getByRole("button", { name: /Back to Home/i });
    const orderAgainBtn = screen.getByRole("button", { name: /Order Again/i });

    expect(goHomeBtn).toBeDisabled();
    expect(orderAgainBtn).toBeDisabled();
  });

  it("should clean storage maps and redirect successfully to home route when already marked saved", async () => {
    localStorage.setItem(storageKey, JSON.stringify(mockOrderData));
    renderComponent();
    const user = userEvent.setup();

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const saveBtn = screen.getByRole("button", { name: /Download E-Receipt File/i });
    await user.click(saveBtn);

    const goHomeBtn = screen.getByRole("button", { name: /Back to Home/i });
    expect(goHomeBtn).toBeEnabled();
    await user.click(goHomeBtn);

    // Verify localStorage key is completely swept
    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(screen.getByText("Home View Screen")).toBeInTheDocument();

    clickSpy.mockRestore();
  });
});