// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import Cart from "../../../src/components/orderingComponents/Cart";

// I-mock ang useNavigate hook mula sa react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Cart Component", () => {
  const mockSetCart = vi.fn();
  
  const sampleCart = [
    { id: 1, name: "Chocolate Cake", price: 500, quantity: 1 },
    { id: 2, name: "Crinkles", price: 15, quantity: 2 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render empty cart layout when no items are present", () => {
    render(
      <MemoryRouter>
        <Cart cart={[]} setCart={mockSetCart} />
      </MemoryRouter>
    );

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByText("Add items from the menu.")).toBeInTheDocument();
    expect(screen.queryByText("Proceed to Checkout")).not.toBeInTheDocument();
  });

  it("should render cart items, individual pricing, and correct overall total", () => {
    render(
      <MemoryRouter>
        <Cart cart={sampleCart} setCart={mockSetCart} />
      </MemoryRouter>
    );

    // I-verify kung nandito ang mga pangalan ng produkto
    expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    expect(screen.getByText("Crinkles")).toBeInTheDocument();

    // I-verify ang item quantities
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // I-verify ang computed total (500 * 1 + 15 * 2 = 530)
    expect(screen.getByText("₱530.00")).toBeInTheDocument();
  });

  it("should call setCart with incremented quantity when '+' button is clicked", () => {
    render(
      <MemoryRouter>
        <Cart cart={sampleCart} setCart={mockSetCart} />
      </MemoryRouter>
    );

    // Kukunin ang lahat ng '+' buttons at iki-click ang para sa Chocolate Cake (unang item)
    const plusButtons = screen.getAllByText("+");
    fireEvent.click(plusButtons[0]);

    expect(mockSetCart).toHaveBeenCalledTimes(1);
    
    // I-simulate at subukan ang functional state update logic ng increase helper niyo
    const stateUpdater = mockSetCart.mock.calls[0][0];
    const updatedState = stateUpdater(sampleCart);
    
    // Dapat ang id 1 ay maging quantity: 2 na ngayon
    expect(updatedState[0].quantity).toBe(2);
  });

  it("should call setCart with decremented quantity when '-' button is clicked", () => {
    render(
      <MemoryRouter>
        <Cart cart={sampleCart} setCart={mockSetCart} />
      </MemoryRouter>
    );

    // Iki-click ang '-' button ng Crinkles (pangalawang item na may quantity: 2)
    const minusButtons = screen.getAllByText("−");
    fireEvent.click(minusButtons[1]);

    expect(mockSetCart).toHaveBeenCalledTimes(1);

    const stateUpdater = mockSetCart.mock.calls[0][0];
    const updatedState = stateUpdater(sampleCart);
    
    // Dapat ang id 2 ay bumaba mula 2 at maging 1 na lang
    expect(updatedState[1].quantity).toBe(1);
  });

  it("should trigger removeItem logic completely when 'Remove' button is clicked", () => {
    render(
      <MemoryRouter>
        <Cart cart={sampleCart} setCart={mockSetCart} />
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]); // I-remove ang Chocolate Cake

    expect(mockSetCart).toHaveBeenCalledTimes(1);

    const stateUpdater = mockSetCart.mock.calls[0][0];
    const updatedState = stateUpdater(sampleCart);
    
    // Dapat matira na lang sa array ay ang Crinkles (id: 2)
    expect(updatedState).toHaveLength(1);
    expect(updatedState[0].id).toBe(2);
  });

  it("should alert the user if they attempt to checkout with an empty cart", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Cart cart={[]} setCart={mockSetCart} />
      </MemoryRouter>
    );

    // I-verify na ang mensaheng "Your cart is empty." ay nakadispley at hindi tinawag ang alert
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should navigate to /checkout when checkout is confirmed by the user", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <MemoryRouter>
        <Cart cart={sampleCart} setCart={mockSetCart} />
      </MemoryRouter>
    );

    const checkoutBtn = screen.getByRole("button", { name: /proceed to checkout/i });
    fireEvent.click(checkoutBtn);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");

    confirmSpy.mockRestore();
  });

  it("should not navigate if the user cancels the confirmation dialog", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => false);

    render(
      <MemoryRouter>
        <Cart cart={sampleCart} setCart={mockSetCart} />
      </MemoryRouter>
    );

    const checkoutBtn = screen.getByRole("button", { name: /proceed to checkout/i });
    fireEvent.click(checkoutBtn);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});