import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import Home from "../../../src/pages/orderingPage/Home";

describe("Home Page Integration Test", () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<div>Menu Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render the hero headers, call-to-action button, and hero image correctly", () => {
    renderComponent();

    // Specifically target the main hero heading using its text content to avoid colliding with Navbar's h1
    const heroHeading = screen.getByRole("heading", { name: /Elevating/i });
    expect(heroHeading).toHaveTextContent("Elevating");
    expect(heroHeading).toHaveTextContent("Everyday");
    expect(heroHeading).toHaveTextContent("Moments.");

    // Validate body description text and CTA button presence
    expect(screen.getByText(/Discover our handcrafted cakes and pastries/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /explore menu/i })).toBeInTheDocument();

    // Validate hero graphic image attributes
    const bannerImg = screen.getByAltText("Cake");
    expect(bannerImg).toBeInTheDocument();
    expect(bannerImg).toHaveAttribute("src", "/cake-banner.jpg");
  });

  it("should render all sub-sections of the homepage layout", () => {
    renderComponent();

    // Fix: Use getAllByText for "Aileen Cake Max" since it renders in multiple locations (e.g. Navbar & Footer)
    const brandElements = screen.getAllByText(/Aileen Cake Max/i);
    expect(brandElements.length).toBeGreaterThan(0);
    expect(brandElements[0]).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "How to Order" })).toBeInTheDocument();
    expect(screen.getByText(/Simple Process/i)).toBeInTheDocument();
  });

  it("should redirect to the menu page when the 'EXPLORE MENU' button is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    const exploreMenuBtn = screen.getByRole("button", { name: /explore menu/i });
    await user.click(exploreMenuBtn);

    // Verify router navigation has successfully shifted to the /menu route
    expect(screen.getByText("Menu Page")).toBeInTheDocument();
  });
});