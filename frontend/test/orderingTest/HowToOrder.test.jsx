// import { render, screen } from "@testing-library/react";
// import { describe, it, expect } from "vitest";
// import HowToOrder from "../components/HowToOrder";

// describe("HowToOrder Component", () => {
//   it("renders complete steps", () => {
//     render(<HowToOrder />);

//     // Title
//     expect(screen.getByText(/how to order/i)).toBeInTheDocument();

//     // Step headings (STRICT match - no collision)
//     expect(screen.getByText("BROWSE MENU")).toBeInTheDocument();
//     expect(screen.getByText("ADD TO CART")).toBeInTheDocument();
//     expect(screen.getByText("CONFIRM DETAILS")).toBeInTheDocument();
//     expect(screen.getByText("ENJOY")).toBeInTheDocument();

//     // Optional: descriptions (unique strings = safe)
//     expect(
//       screen.getByText(/explore our artisan cakes/i)
//     ).toBeInTheDocument();

//     expect(
//       screen.getByText(/select your favorites/i)
//     ).toBeInTheDocument();

//     expect(
//       screen.getByText(/review your order/i)
//     ).toBeInTheDocument();

//     expect(
//       screen.getByText(/enjoy every bite/i)
//     ).toBeInTheDocument();
//   });
// });

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HowToOrder from "../../../src/components/orderingComponents/HowToOrder";

describe("HowToOrder Component", () => {

  it("should render the main section headings", () => {
    render(<HowToOrder />);

    // Verify section main tracking string and header
    expect(screen.getByText(/simple process/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /how to order/i, level: 2 })).toBeInTheDocument();
  });

  it("should display all four sequence steps accurately", () => {
    render(<HowToOrder />);

    // Expected titles in our data configuration array loop
    const expectedTitles = [
      "BROWSE MENU",
      "ADD TO CART",
      "CONFIRM DETAILS",
      "ENJOY"
    ];

    expectedTitles.forEach((title) => {
      expect(screen.getByRole("heading", { name: new RegExp(title, "i"), level: 4 })).toBeInTheDocument();
    });

    // Quick verification of one of the text descriptions
    expect(screen.getByText(/explore our artisan cakes, pastries/i)).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

});