// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { BrowserRouter } from "react-router-dom";
// import { describe, it, expect } from "vitest";
// import Navbar from "../components/Navbar";

// describe("Navbar Component", () => {
//   it("should render Home and Menu links", () => {
//     render(
//       <BrowserRouter>
//         <Navbar />
//       </BrowserRouter>
//     );

//     expect(screen.getByText(/home/i)).toBeInTheDocument();
//     expect(screen.getByText(/menu/i)).toBeInTheDocument();
//   });

//   it("should allow clicking Home and Menu", async () => {
//     const user = userEvent.setup();

//     render(
//       <BrowserRouter>
//         <Navbar />
//       </BrowserRouter>
//     );

//     await user.click(screen.getByText(/home/i));
//     await user.click(screen.getByText(/menu/i));

//     expect(screen.getByText(/home/i)).toBeInTheDocument();
//     expect(screen.getByText(/menu/i)).toBeInTheDocument();
//   });
// });

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "../../src/components/orderingComponents/Navbar"; 

describe("Navbar Component", () => {

  it("should render the brand logo, name, and subtitle", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Verify brand assets and identity text layout
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /aileen cake max/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/bake shop/i)).toBeInTheDocument();
  });

  it("should navigate to the root route when the Home link is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/menu"]}>
        <Routes>
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<div>Home Page Content</div>} />
              </Routes>
            </>
          } />
        </Routes>
      </MemoryRouter>
    );

    // Find the Home navigation link and trigger click
    const homeLink = screen.getByRole("link", { name: /^home$/i });
    fireEvent.click(homeLink);

    // Verify view state changes successfully
    expect(screen.getByText("Home Page Content")).toBeInTheDocument();
  });

  it("should navigate to the menu page when the Menu link is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/menu" element={<div>Menu Page Content</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Find the Menu navigation link and trigger click
    const menuLink = screen.getByRole("link", { name: /^menu$/i });
    fireEvent.click(menuLink);

    // Verify view state changes successfully
    expect(screen.getByText("Menu Page Content")).toBeInTheDocument();
  });

});