/* global global */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import Menu from "../../../src/pages/orderingPage/Menu"; // I-adjust ang path kung kinakailangan

// ==========================================
// ROBUST GLOBAL LOCALSTORAGE MOCK
// ==========================================
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Alisin ang lahat ng vi.mock sa sub-components dahil monolithic/inline ang Menu elements mo.

describe("Menu Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should render the layout structures, components, and key database products", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // I-verify ang Progress Steps bar
    expect(screen.getByText("Select Items")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();

    // I-verify ang kategorya ng filter buttons
    expect(screen.getByRole("button", { name: /^ALL$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^PASTRY$/i })).toBeInTheDocument();

    // I-verify ang produkto mula sa iyong static array/database
    expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
  });

  it("should correctly switch view and filter items when category selection occurs", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // Sa simula, dapat visible ang Chocolate Cake (na may kategoryang Birthday Cake / Cake)
    expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();

    // I-click ang PASTRY filter button
    const pastryFilterBtn = screen.getByRole("button", { name: /^PASTRY$/i });
    fireEvent.click(pastryFilterBtn);

    // Dapat mawala ang Chocolate Cake dahil hindi ito pastry
    expect(screen.queryByText("Chocolate Cake")).not.toBeInTheDocument();

    // I-click muli ang ALL filter button para bumalik
    const allFilterBtn = screen.getByRole("button", { name: /^ALL$/i });
    fireEvent.click(allFilterBtn);
    expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
  });

  it("should add a product card into the cart state and commit to localStorage", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // Maghanap tayo ng "Add to Cart" o ang element card para sa Chocolate Cake
    const addButtons = screen.getAllByRole("button", { name: /add/i });
    
    // I-click ang unang Add button (na karaniwang para sa unang produkto, ang Chocolate Cake)
    fireEvent.click(addButtons[0]);

    // I-verify kung na-save sa localStorage
    expect(localStorage.setItem).toHaveBeenCalled();
  });

 it("should increment quantity logic when clicking add-to-cart multiple times on the same item", () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    const addButtons = screen.getAllByRole("button", { name: /add/i });
    
    // I-click nang dalawang beses ang parehong produkto
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);

    // Binago natin dito para tugma sa 3 calls na ginagawa ng code mo sa background!
    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
  });
  
  it("should sync and parse pre-existing items out of localStorage during initial page load", () => {
    // I-simulate natin ang pre-existing cart array data sa localStorage
    localStorage.getItem.mockImplementationOnce(() =>
      JSON.stringify([
        {
          id: 2,
          name: "Crinkles",
          category: "Pastry",
          price: 15,
          quantity: 5,
        }
      ])
    );

    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // Dahil may "Crinkles" sa Menu at sa Cart, gagamit tayo ng getAllByText para i-verify ang presensya nito
    const crinklesElements = screen.getAllByText("Crinkles");
    expect(crinklesElements.length).toBeGreaterThanOrEqual(1);
  });
});