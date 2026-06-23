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

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
// Pointing back up out of the 'test' folder and into 'src/components'
import Footer from "../src/components/Footer"; 

describe("Footer Component", () => {
  
  it("should render the brand name, description, and sections", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Verify Brand Identity
    expect(screen.getByRole("heading", { name: /aileen cake max/i })).toBeInTheDocument();
    expect(screen.getByText(/handcrafting moments of joy/i)).toBeInTheDocument();

    // Verify Section Headings
    expect(screen.getByRole("heading", { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /shop hours/i })).toBeInTheDocument();
  });

  it("should navigate to the menu page when the Menu link is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Footer />} />
          <Route path="/menu" element={<div>Menu Page Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Find the Menu link and click it
    const menuLink = screen.getByRole("link", { name: /^menu$/i });
    fireEvent.click(menuLink);

    // Verify that the URL swap rendered our mock target layout content
    expect(screen.getByText("Menu Page Content")).toBeInTheDocument();
  });

  it("should navigate to the home page when the Home link is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Footer />} />
          <Route path="/home" element={<div>Home Page Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Find the Home link and click it
    const homeLink = screen.getByRole("link", { name: /^home$/i });
    fireEvent.click(homeLink);

    // Verify that the URL swap rendered our mock target layout content
    expect(screen.getByText("Home Page Content")).toBeInTheDocument();
  });

});