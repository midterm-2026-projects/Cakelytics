// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import { vi, beforeEach, describe, it, expect } from "vitest";
// import Payment from "../../../src/pages/orderingPage/Payment"; // Ayusin ang relative path batay sa iyong system

// // Mocking external layout components upang i-isolate ang test execution
// vi.mock("../../components/orderingComponents/OrderProgress", () => ({
//   default: () => <div data-testid="order-progress">Order Progress Step</div>,
// }));

// // Custom In-Memory LocalStorage Mock upang maiwasan ang error sa window state rendering
// const localStorageMock = (() => {
//   let store = {};
//   return {
//     getItem: (key) => store[key] || null,
//     setItem: (key, value) => { store[key] = String(value); },
//     removeItem: (key) => { delete store[key]; },
//     clear: () => { store = {}; }
//   };
// })();

// Object.defineProperty(window, "localStorage", { value: localStorageMock });

// describe("Payment Page Integration Test", () => {
//   let alertMock;
//   const mockCustomerDetails = {
//     name: "Maria Clara",
//     contact: "09998887777",
//     orderType: "Delivery",
//     address: "Calaca, Batangas"
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//     localStorage.clear();
    
//     // I-setup ang mock data bago i-render ang page
//     localStorage.setItem("customerDetails", JSON.stringify(mockCustomerDetails));
    
//     // I-mock ang window alert upang hindi mag-freeze ang test process
//     alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
//   });

//   const renderComponent = () => {
//     return render(
//       <MemoryRouter initialEntries={["/payment"]}>
//         <Routes>
//           <Route path="/payment" element={<Payment />} />
//           <Route path="/complete" element={<div>Complete Page</div>} />
//         </Routes>
//       </MemoryRouter>
//     );
//   };

//   it("should render customer information and delivery fields correctly from localStorage data", () => {
//     renderComponent();

//     expect(screen.getByRole("heading", { name: /^payment$/i, level: 1 })).toBeInTheDocument();
//     expect(screen.getByText("Customer Information")).toBeInTheDocument();
    
//     // Pagpapatunay na nakuha ang customer state indicators
//     expect(screen.getByText("Maria Clara")).toBeInTheDocument();
//     expect(screen.getByText("09998887777")).toBeInTheDocument();
//     expect(screen.getByText("Delivery")).toBeInTheDocument();
//     expect(screen.getByText("Calaca, Batangas")).toBeInTheDocument();
//   });

//   it("should change the selected payment type radio option when a user interacts with it", async () => {
//     renderComponent();
//     const user = userEvent.setup();

//     const depositRadio = screen.getByLabelText(/50% Deposit/i);
//     const fullPaymentRadio = screen.getByLabelText(/Full Payment/i);

//     // Default choice check batay sa code structure (useState("deposit"))
//     expect(depositRadio).toBeChecked();
//     expect(fullPaymentRadio).not.toBeChecked();

//     // Interaction loop
//     await user.click(fullPaymentRadio);

//     expect(depositRadio).not.toBeChecked();
//     expect(fullPaymentRadio).toBeChecked();
//   });

//   it("should save the selection to localStorage, show an alert, and redirect upon placing the order", async () => {
//     renderComponent();
//     const user = userEvent.setup();

//     // Piliin ang 'Full Payment' para sa test block na ito
//     const fullPaymentRadio = screen.getByLabelText(/Full Payment/i);
//     await user.click(fullPaymentRadio);

//     // Pagpindot sa place order button control link
//     const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
//     await user.click(placeOrderBtn);

//     // Pag-verify kung lumabas ang confirmation text modal
//     expect(alertMock).toHaveBeenCalledWith("Order placed successfully!");

//     // Dapat nai-save sa localStorage ang tamang state value descriptor
//     expect(localStorage.getItem("paymentType")).toBe("full");

//     // Dapat makarating sa itinakdang redirect configuration router screen
//     expect(screen.getByText("Complete Page")).toBeInTheDocument();
//   });
// });

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, beforeEach, describe, it, expect } from "vitest";
import Payment from "../../../src/pages/orderingPage/Payment";

vi.mock("../../components/orderingComponents/OrderProgress", () => ({
  default: () => <div data-testid="order-progress">Order Progress Step</div>,
}));

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

describe("Payment Page Integration Test", () => {
  let alertMock;
  const mockCustomerDetails = {
    name: "Maria Clara",
    contact: "09998887777",
    orderType: "Delivery",
    address: "Calaca, Batangas"
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    localStorage.setItem("customerDetails", JSON.stringify(mockCustomerDetails));
    alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/payment"]}>
        <Routes>
          <Route path="/payment" element={<Payment />} />
          <Route path="/complete" element={<div>Complete Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render customer information and delivery fields correctly from localStorage data", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: /^payment$/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    
    expect(screen.getByText("Maria Clara")).toBeInTheDocument();
    expect(screen.getByText("09998887777")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("Calaca, Batangas")).toBeInTheDocument();
  });

  it("should change the selected payment type radio option when a user interacts with it", async () => {
    renderComponent();
    const user = userEvent.setup();

    const depositRadio = screen.getByRole("radio", { name: /50% Deposit/i });
    const fullPaymentRadio = screen.getByRole("radio", { name: /Full Payment/i });

    expect(depositRadio).toBeChecked();
    expect(fullPaymentRadio).not.toBeChecked();

    await user.click(fullPaymentRadio);

    expect(depositRadio).not.toBeChecked();
    expect(fullPaymentRadio).toBeChecked();
  });

  it("should save the selection to localStorage, show an alert, and redirect upon placing the order", async () => {
    renderComponent();
    const user = userEvent.setup();

    const fullPaymentRadio = screen.getByRole("radio", { name: /Full Payment/i });
    await user.click(fullPaymentRadio);

    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    await user.click(placeOrderBtn);

    expect(alertMock).toHaveBeenCalledWith("Order placed successfully!");
    expect(localStorage.getItem("paymentType")).toBe("full");
    expect(screen.getByText("Complete Page")).toBeInTheDocument();
  });
});