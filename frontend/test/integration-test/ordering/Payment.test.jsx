import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import Payment from "../../../src/pages/orderingPage/Payment";

vi.mock("../../components/orderingComponents/OrderProgress", () => ({
  default: () => <div data-testid="order-progress">Order Progress Step</div>,
}));

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

describe("Payment Page Integration Test", () => {
  let alertMock;
  const mockCustomerDetails = {
    name: "Maria Clara",
    contact: "09998887777",
    orderType: "Delivery",
    address: "Calaca, Batangas"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    localStorage.setItem("customerDetails", JSON.stringify(mockCustomerDetails));
    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/payment"]}>
        <Routes>
          <Route path="/payment" element={<Payment />} />
          <Route path="/complete" element={<div>Complete Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render customer information and delivery fields correctly from localStorage data", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: /^payment$/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    
    expect(screen.getByText("Maria Clara")).toBeInTheDocument();
    expect(screen.getByText("09998887777")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("Calaca, Batangas")).toBeInTheDocument();
  });

  it("should change the selected payment type radio option when a user interacts with it", async () => {
    renderComponent();
    const user = userEvent.setup();

    const depositRadio = screen.getByRole("radio", { name: /50% Deposit/i });
    const fullPaymentRadio = screen.getByRole("radio", { name: /Full Payment/i });

    expect(depositRadio).toBeChecked();
    expect(fullPaymentRadio).not.toBeChecked();

    await user.click(fullPaymentRadio);

    expect(depositRadio).not.toBeChecked();
    expect(fullPaymentRadio).toBeChecked();
  });

  it("should save the selection to localStorage, show an alert, and redirect upon placing the order", async () => {
    renderComponent();
    const user = userEvent.setup();

    const fullPaymentRadio = screen.getByRole("radio", { name: /Full Payment/i });
    await user.click(fullPaymentRadio);

    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(placeOrderBtn);

    expect(alertMock).toHaveBeenCalledWith("Order placed successfully!");
    expect(localStorage.getItem("paymentType")).toBe("full");
    expect(screen.getByText("Complete Page")).toBeInTheDocument();
  });
});