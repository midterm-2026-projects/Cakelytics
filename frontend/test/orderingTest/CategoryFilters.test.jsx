import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import CategoryFilters from "../../src/components/orderingComponents/CategoryFilters";

describe("CategoryFilters Component", () => {

  it("should render all the category buttons correctly", () => {
    const mockFilterCategory = vi.fn();
    
    render(
      <CategoryFilters 
        selectedCategory="ALL" 
        filterCategory={mockFilterCategory} 
      />
    );

    // I-verify kung lumabas ang lahat ng 4 na buttons na tinukoy sa array niyo
    expect(screen.getByRole("button", { name: "ALL" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PASTRY" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PACKAGE" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CELEBRATION MATERIAL" })).toBeInTheDocument();
  });

  it("should apply the active CSS classes to the selected category button", () => {
    const mockFilterCategory = vi.fn();
    
    render(
      <CategoryFilters 
        selectedCategory="PASTRY" 
        filterCategory={mockFilterCategory} 
      />
    );

    const activeBtn = screen.getByRole("button", { name: "PASTRY" });
    const inactiveBtn = screen.getByRole("button", { name: "ALL" });

    // Dapat ang active category ay may white text at dark brown background base sa layout logic mo
    expect(activeBtn).toHaveClass("bg-[#5A3B2E]", "text-white");
    
    // Ang inactive naman ay dapat gamitin ang default beige theme classes niyo
    expect(inactiveBtn).toHaveClass("bg-[#EFE8E3]", "text-[#8A6A59]");
  });

  it("should fire the filterCategory function with the correct category string when clicked", () => {
    const mockFilterCategory = vi.fn();
    
    render(
      <CategoryFilters 
        selectedCategory="ALL" 
        filterCategory={mockFilterCategory} 
      />
    );

    const packageBtn = screen.getByRole("button", { name: "PACKAGE" });
    
    // I-simulate ang click action sa button ng PACKAGE
    fireEvent.click(packageBtn);

    // Sinisiguro natin na tinawag ang function mo ng 1 beses lang at 'PACKAGE' ang argument na ipinasa nito
    expect(mockFilterCategory).toHaveBeenCalledTimes(1);
    expect(mockFilterCategory).toHaveBeenCalledWith("PACKAGE");
  });

});