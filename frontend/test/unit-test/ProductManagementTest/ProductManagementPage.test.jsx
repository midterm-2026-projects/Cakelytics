import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProductManagementPage from "../../../src/pages/ProductManagementPage/ProductManagementPage";

const user = userEvent.setup();

describe("ProductManagementPage - Integration Test", () => {
  beforeEach(() => {
    // Mock the global alert window for add, edit, and delete clicks
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the full page along with the default number of products", () => {
    render(<ProductManagementPage />);

    // Verify the Header title renders correctly
    expect(screen.getByRole("heading", { name: "Product Management" })).toBeInTheDocument();

    // Verify the Add Product button is present
    expect(screen.getByRole("button", { name: /add product/i })).toBeInTheDocument();

    // Verify default products (e.g., "Package A" and "Printed Balloons") are rendered
    expect(screen.getByText("Package A")).toBeInTheDocument();
    expect(screen.getByText("Printed Balloons")).toBeInTheDocument();
  });

  it("should filter products based on text typed into the search input bar", async () => {
    render(<ProductManagementPage />);

    const searchInput = screen.getByPlaceholderText(/search product.../i);

    // Default state: both Package A and Package B are visible
    expect(screen.getByText("Package A")).toBeInTheDocument();
    expect(screen.getByText("Package B")).toBeInTheDocument();

    // Type a specific name query (Case-insensitive check verification)
    await user.type(searchInput, "package ab");

    // Only Package AB should remain visible
    expect(screen.getByText("Package AB")).toBeInTheDocument();
    expect(screen.queryByText("Package A")).not.toBeInTheDocument();
    expect(screen.queryByText("Package B")).not.toBeInTheDocument();
  });

  it("should filter products when clicking a category filter button", async () => {
    render(<ProductManagementPage />);

    // Click the filter button for "Celebration Material"
    const celebrationFilterBtn = screen.getByRole("button", { name: "Celebration Material" });
    await user.click(celebrationFilterBtn);

    // "Printed Balloons" should appear since its category matches
    expect(screen.getByText("Printed Balloons")).toBeInTheDocument();

    // Products under the "PACKAGE" category like Package A should be hidden
    expect(screen.queryByText("Package A")).not.toBeInTheDocument();
  });

  it("should display a 'No products match' message when no search matches are found", async () => {
    render(<ProductManagementPage />);

    const searchInput = screen.getByPlaceholderText(/search product.../i);

    // Type an arbitrary string that will not match any existing product
    await user.type(searchInput, "NonExistentCake12345");

    // The empty state fallback content must render correctly
    expect(screen.getByText(/no products match your search/i)).toBeInTheDocument();
  });

  it("should trigger window alerts when clicking the Add, Edit, or Delete buttons", async () => {
    render(<ProductManagementPage />);

    // 1. Test the Add Product click trigger handler
    const addBtn = screen.getByRole("button", { name: /add product/i });
    await user.click(addBtn);
    expect(window.alert).toHaveBeenCalledWith("Add product clicked");

    // 2. Test the Edit button on a product card (selects the first available Edit button)
    const editBtns = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editBtns[0]);
    expect(window.alert).toHaveBeenCalledWith("Edit Package A");

    // 3. Test the Delete button on a product card (selects the first available Delete button)
    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteBtns[0]);
    expect(window.alert).toHaveBeenCalledWith("Delete Package A");
  });
});