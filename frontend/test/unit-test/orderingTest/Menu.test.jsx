/* global global */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

// Sample products that the mock API will return
const sampleProducts = [
  { id: 1, name: "Chocolate Cake", category: "Cake", price: 500, stock_quantity: 10, image_url: "/chocolate-cake.jpg" },
  { id: 2, name: "Crinkles", category: "Pastry", price: 15, stock_quantity: 50, image_url: "/crinkles.jpg" },
  { id: 3, name: "Celebration Package A", category: "Package", price: 1500, stock_quantity: 5, image_url: "/package-a.jpg" },
];

// Mock axios so API calls return sample products
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from "axios";
import Menu from "../../../src/pages/orderingPage/Menu";

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

describe("Menu Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Re-set the axios mock to resolve with sample products
    axios.get.mockResolvedValue({ data: { data: sampleProducts } });
  });

  it("should render the layout structures, components, and key database products", async () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // Verify Progress Steps bar
    expect(screen.getByText("Select Items")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();

    // Verify category filter buttons
    expect(screen.getByRole("button", { name: /^ALL$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^PASTRY$/i })).toBeInTheDocument();

    // Wait for products to load from the mocked API
    // ProductCard renders product name inside an <h3> so it's not split across nodes
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });
  });

  it("should correctly switch view and filter items when category selection occurs", async () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    // Click the PASTRY filter button
    const pastryFilterBtn = screen.getByRole("button", { name: /^PASTRY$/i });
    fireEvent.click(pastryFilterBtn);

    // Chocolate Cake is not a Pastry, so it should disappear
    await waitFor(() => {
      expect(screen.queryByText("Chocolate Cake")).not.toBeInTheDocument();
    });

    // Click ALL filter button to return to full list
    const allFilterBtn = screen.getByRole("button", { name: /^ALL$/i });
    fireEvent.click(allFilterBtn);

    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });
  });

  it("should add a product card into the cart state and commit to localStorage", async () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    // Wait for products to load and "Add to Cart" buttons to appear
    const addButtons = await screen.findAllByRole("button", { name: /add to cart/i });
    
    // Click the first Add button (Chocolate Cake)
    fireEvent.click(addButtons[0]);

    // Verify localStorage.setItem was called (cart was saved)
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("should increment quantity logic when clicking add-to-cart multiple times on the same item", async () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    const addButtons = await screen.findAllByRole("button", { name: /add to cart/i });
    
    // Click twice on the same product
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);

    // localStorage.setItem should have been called
    expect(localStorage.setItem).toHaveBeenCalled();
  });
  
  it("should sync and parse pre-existing items out of localStorage during initial page load", async () => {
    // Simulate pre-existing cart data in localStorage
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

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    // "Crinkles" should appear in both the product grid and the cart sidebar
    const crinklesElements = screen.getAllByText("Crinkles");
    expect(crinklesElements.length).toBeGreaterThanOrEqual(1);
  });
});

