import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import axios from "axios";
import Menu from "../../../src/pages/orderingPage/Menu";

// Mock Axios
vi.mock("axios");

// Mock sub-components if they require deep integration or external context that might fail
// (Only uncomment these if you encounter rendering issues with your child components)
/*
vi.mock("../../components/orderingComponents/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>
}));
vi.mock("../../components/orderingComponents/OrderProgress", () => ({
  default: () => <div>Select Items / Details</div>
}));
vi.mock("../../components/orderingComponents/Footer", () => ({
  default: () => <footer>Footer</footer>
}));
*/

// Mock Products matching the structure expected by the .map loop in Menu.jsx
const mockProductsResponse = {
  data: [
    { 
      id: 1, 
      name: "Chocolate Cake", 
      price: 850, 
      category: "Cakes", 
      stock_quantity: 10, 
      image_url: "/test-cake.jpg" 
    },
    { 
      id: 2, 
      name: "Pastry Item", 
      price: 100, 
      category: "Pastry", 
      stock_quantity: 5, 
      image_url: "/test-pastry.jpg" 
    }
  ]
};

// Clean and writable LocalStorage Mock
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

describe("Menu Page Integration Test", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Default successful API response
    axios.get.mockResolvedValue(mockProductsResponse);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );
  };

  it("should render default product listing elements and core layout structures correctly", async () => {
    renderComponent();

    // Verify core progress layouts are visible
    expect(screen.getByText("Select Items")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    
    // Wait for the mock API response to resolve and render products
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    expect(screen.getByText("Pastry Item")).toBeInTheDocument();
  });

  it("should filter the product items display reactively when a category filter method is triggered", async () => {
    renderComponent();
    const user = userEvent.setup();

    // Wait for initial products to load first
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    // Find and click the Pastry filter button
    const pastryFilterBtn = screen.getByRole("button", { name: /^pastry$/i });
    await user.click(pastryFilterBtn);

    // Verify filter is active
    expect(pastryFilterBtn).toBeInTheDocument();
    
    // The list should update to only show Pastry items
    expect(screen.getByText("Pastry Item")).toBeInTheDocument();
    expect(screen.queryByText("Chocolate Cake")).not.toBeInTheDocument();
  });

  it("should add a product to the cart and persist the updated data status into localStorage", async () => {
    renderComponent();
    const user = userEvent.setup();

    // Wait for the items to load
    await waitFor(() => {
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
    });

    // Grab the add button for the Chocolate Cake (the first product card)
    const addBtn = screen.getAllByRole("button", { name: /add/i })[0];
    await user.click(addBtn);

    // Assert that the state update saved the selection into localStorage
    await waitFor(() => {
      const updatedCartStore = JSON.parse(localStorage.getItem("cart")) || [];
      expect(updatedCartStore).toHaveLength(1);
      expect(updatedCartStore[0].name).toBe("Chocolate Cake");
      expect(updatedCartStore[0].quantity).toBe(1);
    });
  });
});