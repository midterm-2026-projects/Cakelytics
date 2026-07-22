/* global global */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

import axios from "axios";
import Menu from "../../../src/pages/orderingPage/Menu";


// ===============================
// MOCK AXIOS
// ===============================
vi.mock("axios");


// ===============================
// MOCK COMPONENTS
// ===============================

vi.mock(
  "../../../src/components/orderingComponents/Navbar",
  () => ({
    default: () => <div>Navbar</div>
  })
);


vi.mock(
  "../../../src/components/orderingComponents/Footer",
  () => ({
    default: () => <div>Footer</div>
  })
);


vi.mock(
  "../../../src/components/orderingComponents/OrderProgress",
  () => ({
    default: () => (
      <div>
        Select Items
        Details
      </div>
    )
  })
);


vi.mock(
  "../../../src/components/orderingComponents/CategoryFilters",
  () => ({
    default: ({filterCategory}) => (
      <div>

        <button
          onClick={()=>filterCategory("ALL")}
        >
          ALL
        </button>


        <button
          onClick={()=>filterCategory("PASTRY")}
        >
          PASTRY
        </button>

      </div>
    )
  })
);



vi.mock(
  "../../../src/components/orderingComponents/ProductCard",
  () => ({
    default: ({product, addToCart}) => (

      <div>

        <h3>
          {product.name}
        </h3>


        <button
          onClick={()=>addToCart(product)}
        >
          Add
        </button>

      </div>

    )
  })
);



vi.mock(
  "../../../src/components/orderingComponents/Cart",
  () => ({
    default: ({cart}) => (

      <div>
        {
          cart.map(item=>(
            <p key={item.id}>
              {item.name}
            </p>
          ))
        }
      </div>

    )
  })
);



// ===============================
// LOCAL STORAGE MOCK
// ===============================

const localStorageMock = (() => {

  let store = {};

  return {

    getItem: vi.fn(
      key => store[key] || null
    ),

    setItem: vi.fn(
      (key,value)=>{
        store[key]=value.toString();
      }
    ),

    clear: vi.fn(()=>{
      store={};
    }),

    removeItem: vi.fn(
      key=>{
        delete store[key];
      }
    )

  };

})();


Object.defineProperty(
  global,
  "localStorage",
  {
    value: localStorageMock
  }
);




// ===============================
// TESTS
// ===============================

describe("Menu Component",()=>{


beforeEach(()=>{

  localStorage.clear();

  vi.clearAllMocks();


  axios.get.mockResolvedValue({

    data:[
      {
        id:"1",
        name:"Chocolate Cake",
        category:"Cake",
        price:850,
        stock_quantity:10,
        image_url:"cake.jpg"
      },

      {
        id:"2",
        name:"Crinkles",
        category:"Pastry",
        price:15,
        stock_quantity:20,
        image_url:"crinkles.jpg"
      }

    ]

  });


});




it("should fetch and render products from backend", async()=>{


render(
  <MemoryRouter>
    <Menu/>
  </MemoryRouter>
);


expect(
  screen.getByText("Loading menu items...")
).toBeInTheDocument();



await waitFor(()=>{

 expect(
   screen.getByText("Chocolate Cake")
 )
 .toBeInTheDocument();


});


expect(
 screen.getByText("Crinkles")
)
.toBeInTheDocument();


});






it("should filter products by category", async()=>{


render(
 <MemoryRouter>
  <Menu/>
 </MemoryRouter>
);



await waitFor(()=>{

 expect(
  screen.getByText("Chocolate Cake")
 )
 .toBeInTheDocument();

});



fireEvent.click(
 screen.getByRole(
  "button",
  {
   name:/PASTRY/i
  }
 )
);



expect(
 screen.queryByText("Chocolate Cake")
)
.not
.toBeInTheDocument();



expect(
 screen.getByText("Crinkles")
)
.toBeInTheDocument();



});







it("should add product to cart and save localStorage", async()=>{


render(
 <MemoryRouter>
  <Menu/>
 </MemoryRouter>
);



await waitFor(()=>{

 expect(
  screen.getByText("Chocolate Cake")
 )
 .toBeInTheDocument();

});



const addButtons =
screen.getAllByRole(
 "button",
 {
  name:/Add/i
 }
);



fireEvent.click(
 addButtons[0]
);



expect(
 localStorage.setItem
)
.toHaveBeenCalled();



});







it("should load existing cart from localStorage", async()=>{


localStorage.getItem.mockReturnValueOnce(

 JSON.stringify([

  {
   id:"2",
   name:"Crinkles",
   category:"Pastry",
   price:15,
   quantity:5
  }

 ])

);



render(
 <MemoryRouter>
  <Menu/>
 </MemoryRouter>
);



await waitFor(()=>{


expect(
 screen.getByText("Crinkles")
)
.toBeInTheDocument();


});


});



});