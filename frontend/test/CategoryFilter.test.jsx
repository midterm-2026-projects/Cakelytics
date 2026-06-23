import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilters from "../src/components/CategoryFilter";

describe("CategoryFilters Component", () => {
  
  it("should render all category buttons", () => {
    render(
      <CategoryFilters
        activeCategory="All"
        setActiveCategory={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Package" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pastry" })).toBeInTheDocument();
  });

  it("should highlight the active category", () => {
    render(
      <CategoryFilters
        activeCategory="Package"
        setActiveCategory={vi.fn()}
      />
    );

    const packageButton = screen.getByRole("button", {
      name: "Package",
    });

    expect(packageButton.className).toContain("bg-[#53362f]");
  });

  it("should call setActiveCategory when a category is clicked", async () => {
    const user = userEvent.setup();
    const mockSetActiveCategory = vi.fn();

    render(
      <CategoryFilters
        activeCategory="All"
        setActiveCategory={mockSetActiveCategory}
      />
    );

    const pastryButton = screen.getByRole("button", {
      name: "Pastry",
    });

    await user.click(pastryButton);

    expect(mockSetActiveCategory).toHaveBeenCalledTimes(1);
    expect(mockSetActiveCategory).toHaveBeenCalledWith("Pastry");
  });

  it("should call setActiveCategory with Package when Package button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetActiveCategory = vi.fn();

    render(
      <CategoryFilters
        activeCategory="All"
        setActiveCategory={mockSetActiveCategory}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Package" })
    );

    expect(mockSetActiveCategory).toHaveBeenCalledWith("Package");
  });
});