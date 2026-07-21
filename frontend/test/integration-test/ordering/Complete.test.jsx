// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import { vi, beforeEach, describe, it, expect } from "vitest";
// import Complete from "../../../src/pages/orderingPage/Complete"; // Paki-double check kung tama ang relative path mo rito

// // Custom In-Memory LocalStorage Mock para hindi mag-error ang <OrderProgress /> kapag naghahanap ng data
// const localStorageMock = (() => {
//   let store = {};
//   return {
//     getItem: (key) => store[key] || null,
//     setItem: (key, value) => { store[key] = String(value); },
//     removeItem: (key) => { delete store[key]; },
//     clear: () => { store = {}; }
//   };
// })();

// // I-assign sa global scope bago tumakbo ang mga tests
// Object.defineProperty(window, "localStorage", { value: localStorageMock });

// // Mocking external layout child component para siguradong hindi mag-render ang original
// vi.mock("../../components/orderingComponents/OrderProgress", () => ({
//   default: () => <div data-testid="order-progress">Order Progress Step</div>,
// }));

// describe("Complete Page Integration Test", () => {

//   beforeEach(() => {
//     vi.clearAllMocks();
//     localStorage.clear();
//   });
  
//   const renderComponent = () => {
//     return render(
//       <MemoryRouter initialEntries={["/complete"]}>
//         <Routes>
//           <Route path="/complete" element={<Complete />} />
//           <Route path="/" element={<div>Home Page</div>} />
//           <Route path="/menu" element={<div>Menu Page</div>} />
//         </Routes>
//       </MemoryRouter>
//     );
//   };

//   it("should render order success details and shop brand name correctly", () => {
//     renderComponent();

//     // Sinusuri kung lumabas ang mahahalagang teksto at pamagat sa UI
//     expect(screen.getByText("Order Placed Successfully!")).toBeInTheDocument();
//     expect(screen.getByText("Aileen and Niculus Bake Shop")).toBeInTheDocument();
    
//     // Sinusuri ang mga detalye ng status box
//     expect(screen.getByText("Status:")).toBeInTheDocument();
//     expect(screen.getByText("Pending")).toBeInTheDocument();
//     expect(screen.getByText("Payment:")).toBeInTheDocument();
//     expect(screen.getByText("Waiting for Confirmation")).toBeInTheDocument();
//     expect(screen.getByText("Pickup")).toBeInTheDocument();
//   });

//   it("should redirect to the home page when the 'Back to Home' link is clicked", async () => {
//     renderComponent();
//     const user = userEvent.setup();

//     // Hanapin ang button/link para sa pagbalik sa Home
//     const backToHomeLink = screen.getByRole("link", { name: /back to home/i });
//     await user.click(backToHomeLink);

//     // Dapat magbago ang screen patungo sa Home Page
//     expect(screen.getByText("Home Page")).toBeInTheDocument();
//   });

//   it("should redirect to the menu page when the 'Order Again' link is clicked", async () => {
//     renderComponent();
//     const user = userEvent.setup();

//     // Hanapin ang button/link para mag-order muli
//     const orderAgainLink = screen.getByRole("link", { name: /order again/i });
//     await user.click(orderAgainLink);

//     // Dapat magbago ang screen patungo sa Menu Page
//     expect(screen.getByText("Menu Page")).toBeInTheDocument();
//   });
// });

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import Complete from "../../../src/pages/orderingPage/Complete";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

vi.mock("../../components/orderingComponents/OrderProgress", () => ({
  default: () => <div data-testid="order-progress">Order Progress Step</div>,
}));

describe("Complete Page Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });
  
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/complete"]}>
        <Routes>
          <Route path="/complete" element={<Complete />} />
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/menu" element={<div>Menu Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render order success details and shop brand name correctly", () => {
    renderComponent();

    expect(screen.getByText("Order Placed Successfully!")).toBeInTheDocument();
    expect(screen.getByText("Aileen and Niculus Bake Shop")).toBeInTheDocument();
    
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Payment:")).toBeInTheDocument();
    expect(screen.getByText("Waiting for Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Pickup")).toBeInTheDocument();
  });

  it("should redirect to the home page when the 'Back to Home' link is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    const backToHomeLink = screen.getByRole("link", { name: /back to home/i });
    await user.click(backToHomeLink);

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("should redirect to the menu page when the 'Order Again' link is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    const orderAgainLink = screen.getByRole("link", { name: /order again/i });
    await user.click(orderAgainLink);

    expect(screen.getByText("Menu Page")).toBeInTheDocument();
  });
});