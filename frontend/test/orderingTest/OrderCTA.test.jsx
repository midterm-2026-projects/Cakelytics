import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import OrderCTA from "../../../src/components/orderingComponents/OrderCTA"; // I-adjust ang path depende kung nasaan ito

describe("OrderCTA Component", () => {
  
  it("should render the call-to-action text and link correctly", () => {
    render(
      <MemoryRouter>
        <OrderCTA />
      </MemoryRouter>
    );

    // I-verify kung lumalabas ang CTA message
    const ctaText = screen.getByText(/want something customized for your special day\?/i);
    expect(ctaText).toBeInTheDocument();

    // I-verify kung ang link ay may tamang HTML role ('link') at accessible name
    const orderLink = screen.getByRole("link", { name: /start your order here/i });
    expect(orderLink).toBeInTheDocument();
    
    // I-verify kung tama ang pinupuntahang path href nito
    expect(orderLink).toHaveAttribute("href", "/menu");
  });

  it("should navigate to the menu page when the link is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<OrderCTA />} />
          <Route path="/menu" element={<div data-testid="menu-page">Menu Page Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Hanapin ang link at i-click ito
    const orderLink = screen.getByRole("link", { name: /start your order here/i });
    fireEvent.click(orderLink);

    // I-verify kung nagbago ang view at matagumpay na lumipat sa Menu page
    const menuPage = screen.getByTestId("menu-page");
    expect(menuPage).toBeInTheDocument();
    expect(screen.getByText("Menu Page Content")).toBeInTheDocument();
  });

});