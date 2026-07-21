import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import OrderProgress from "../../../src/components/orderingComponents/OrderProgress";

describe("OrderProgress Component", () => {
  
  // Highlight-start
  // Bulletproof in-memory fallback for Node environments
  beforeEach(() => {
    if (typeof global.localStorage === "undefined" || !global.localStorage.clear) {
      let store = {};
      global.localStorage = {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = String(value); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
      };
    } else {
      localStorage.clear();
    }
  });
  // Highlight-end

  it("renders all four steps correctly", () => {
    renderWithRouter(["/menu"]);

    expect(screen.getByText("Select Items")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("highlights the active step and shows later steps as pending", () => {
    renderWithRouter(["/checkout"]);

    expect(screen.getByText("✓")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("handles a non-matching or initial path gracefully", () => {
    renderWithRouter(["/unknown-path"]);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.queryByText("✓")).not.toBeInTheDocument();
  });

  it("marks the final step as complete when receiptSaved is true in localStorage", () => {
    localStorage.setItem("receiptSaved", "true");
    renderWithRouter(["/receipt"]);

    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBe(4); 
  });

  it("does not mark the final step as complete if receiptSaved is false/missing", () => {
    localStorage.setItem("receiptSaved", "false");
    renderWithRouter(["/receipt"]);

    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBe(3);
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});

// Helper function to render the component within a router context
const renderWithRouter = (initialEntries) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <OrderProgress />
    </MemoryRouter>
  );
};