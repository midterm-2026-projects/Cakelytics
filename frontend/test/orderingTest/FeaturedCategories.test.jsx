import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import FeaturedCategories from "../../src/components/orderingComponents/FeaturedCategories";

describe("FeaturedCategories Component", () => {

  it("should render both category cards with their titles, descriptions, and images", () => {
    render(
      <MemoryRouter>
        <FeaturedCategories />
      </MemoryRouter>
    );

    // 1. Verify Headings are present
    expect(screen.getByRole("heading", { name: /celebration packages/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /filipino common pastries/i })).toBeInTheDocument();

    // 2. Verify Descriptions are present
    expect(screen.getByText(/complete sets featuring our signature themed cakes/i)).toBeInTheDocument();
    expect(screen.getByText(/freshly baked daily treats from our classic crinkles/i)).toBeInTheDocument();

    // 3. Verify Images are rendered with correct alt text
    const celebrationImg = screen.getByAltText("Celebration Packages");
    const pastriesImg = screen.getByAltText("Filipino Common Pastries");
    
    expect(celebrationImg).toBeInTheDocument();
    expect(celebrationImg).toHaveAttribute("src", "/categories/celebration.jpg");
    
    expect(pastriesImg).toBeInTheDocument();
    expect(pastriesImg).toHaveAttribute("src", "/categories/pastries.jpg");
  });

  it("should have correct href links pointing to the menu page", () => {
    render(
      <MemoryRouter>
        <FeaturedCategories />
      </MemoryRouter>
    );

    // Kukunin lahat ng clickable links (dapat dalawa sila)
    const categoryLinks = screen.getAllByRole("link");
    expect(categoryLinks).toHaveLength(2);

    // I-verify kung pareho silang nakaturo sa /menu
    categoryLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/menu");
    });
  });

  it("should successfully navigate to the menu page when a category card is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<FeaturedCategories />} />
          <Route path="/menu" element={<div data-testid="mock-menu-page">Welcome to Menu Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Hanapin at i-click ang unang card (Celebration Packages)
    const firstCard = screen.getByRole("heading", { name: /celebration packages/i });
    fireEvent.click(firstCard);

    // I-verify kung lumipat ba ang route papunta sa simulation menu container natin
    expect(screen.getByTestId("mock-menu-page")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Menu Page")).toBeInTheDocument();
  });

});