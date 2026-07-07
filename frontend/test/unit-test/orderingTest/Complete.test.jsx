//@vitest-environment jsdom

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

import Complete from "../../../src/pages/orderingPage/Complete";

// --------------------
// Mock OrderProgress
// --------------------
vi.mock(
  "../../../src/components/orderingComponents/OrderProgress",
  () => ({
    default: () => (
      <div data-testid="order-progress">
        Order Progress
      </div>
    ),
  })
);

describe("Complete Component", () => {
  it("renders successfully", () => {
    render(
      <MemoryRouter>
        <Complete />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("order-progress")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Order Placed Successfully!/i)
    ).toBeInTheDocument();
  });

  it("should displays shop information", () => {
    render(
      <MemoryRouter>
        <Complete />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Thank you for choosing/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Aileen and Niculus Bake Shop/i)
    ).toBeInTheDocument();
  });

  it("should displays order status", () => {
    render(
      <MemoryRouter>
        <Complete />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Pending/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Waiting for Confirmation/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Please wait for our confirmation./i)
    ).toBeInTheDocument();
  });

  it("should renders Back to Home link", () => {
    render(
      <MemoryRouter>
        <Complete />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", {
      name: /Back to Home/i,
    });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should renders Order Again link", () => {
    render(
      <MemoryRouter>
        <Complete />
      </MemoryRouter>
    );

    const menuLink = screen.getByRole("link", {
      name: /Order Again/i,
    });

    expect(menuLink).toBeInTheDocument();
    expect(menuLink).toHaveAttribute("href", "/menu");
  });

  it("should renders exactly two navigation links", () => {
    render(
      <MemoryRouter>
        <Complete />
      </MemoryRouter>
    );

    expect(
      screen.getAllByRole("link")
    ).toHaveLength(2);
  });
});