// import { render, screen } from "@testing-library/react";
// import { describe, it, expect, vi } from "vitest";
// import { BrowserRouter } from "react-router-dom";
// import Home from "../src/pages/Home";
// import HowToOrder from "../components/HowToOrder";

// vi.mock("react-router-dom", async () => {
//   const actual = await vi.importActual("react-router-dom");

//   return {
//     ...actual,
//     useNavigate: () => vi.fn(),
//   };
// });

// describe("Home Page", () => {
//   it("should render homepage banner and introduction", () => {
//     render(
//       <BrowserRouter>
//         <Home />
//       </BrowserRouter>
//     );

//     expect(screen.getByText(/elevating/i)).toBeInTheDocument();
//     expect(screen.getByText(/everyday/i)).toBeInTheDocument();
//     expect(screen.getByText(/moments/i)).toBeInTheDocument();
//     expect(screen.getByText(/explore menu/i)).toBeInTheDocument();
//   });

//   it("should render How To Order section", () => {
//     render(
//       <BrowserRouter>
//         <Home />
//         <HowToOrder />
//       </BrowserRouter>
//     );

//     expect(screen.getByText(/how to order/i)).toBeInTheDocument();
//   });
// });

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Home from "../../src/pages/orderingPage/Home";

describe("Home Component", () => {

  it("should render the hero texts and the explore button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Verify main headings are present
    expect(screen.getByRole("heading", { name: /elevating/i })).toBeInTheDocument();
    expect(screen.getByText(/discover our handcrafted cakes/i)).toBeInTheDocument();

    // Verify button is present
    expect(screen.getByRole("button", { name: /explore menu/i })).toBeInTheDocument();
  });

  it("should navigate to the menu page when the Explore Menu button is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<div>Menu Page Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Find the button and click it
    const exploreBtn = screen.getByRole("button", { name: /explore menu/i });
    fireEvent.click(exploreBtn);

    // Verify that useNavigate was fired and switched to the menu page content
    expect(screen.getByText("Menu Page Content")).toBeInTheDocument();
  });

});