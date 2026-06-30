// import { render, screen } from "@testing-library/react";
// import { describe, it, expect } from "vitest";
// import { BrowserRouter } from "react-router-dom";
// import Footer from "../src/components/Footer";

// describe("Footer Component", () => {
//   it(" should render brand name and description", () => {
//     render(
//       <BrowserRouter>
//         <Footer />
//       </BrowserRouter>
//     );
    
//     expect(
//       screen.getByRole("heading", { name: /aileen cake max/i })
//     ).toBeInTheDocument();

//     expect(
//       screen.getByText(/handcrafting moments of joy/i)
//     ).toBeInTheDocument();
//   });

//   it("should render navigation links", () => {
//     render(
//       <BrowserRouter>
//         <Footer />
//       </BrowserRouter>
//     );

//     expect(screen.getByText(/menu/i)).toBeInTheDocument();
//     expect(screen.getByText(/home/i)).toBeInTheDocument();
//     expect(screen.getByText(/how to order/i)).toBeInTheDocument();
//   });

//   it("should render contact information", () => {
//     render(
//       <BrowserRouter>
//         <Footer />
//       </BrowserRouter>
//     );

//     expect(screen.getByText(/0975-858-3764/i)).toBeInTheDocument();
//     expect(
//       screen.getByText(/hello@aileencakemax.com/i)
//     ).toBeInTheDocument();
//   });

//   it("should render copyright text", () => {
//     render(
//       <BrowserRouter>
//         <Footer />
//       </BrowserRouter>
//     );

//     expect(
//       screen.getByText(/all rights reserved/i)
//     ).toBeInTheDocument();
//   });
// });

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import Footer from "../../src/components/orderingComponents/Footer";

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

describe("Footer Component", () => {
  it("should render the brand name, description, and sections", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("Aileen Cake Max")).toBeInTheDocument();
    expect(screen.getByText(/Handcrafting moments of joy/i)).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
  });

  it("should navigate to the menu page when the Menu link is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="*" element={<><Footer /><LocationDisplay /></>} />
        </Routes>
      </MemoryRouter>
    );

    const menuLink = screen.getByRole("link", { name: /^menu$/i });
    await user.click(menuLink);

    // ✅ Tiyakin na ang React Router state ay lumipat na sa /menu
    expect(screen.getByTestId("location-display")).toHaveTextContent("/menu");
  });

  it("should navigate to the home page when the Home link is clicked", async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={["/menu"]}>
        <Routes>
          <Route path="*" element={<><Footer /><LocationDisplay /></>} />
        </Routes>
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", { name: /^home$/i });
    await user.click(homeLink);

    
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
  });
});