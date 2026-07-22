/* global global */

import {
  describe,
  it,
  expect,
  beforeEach,
  vi
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";

import {
  MemoryRouter
} from "react-router-dom";

import "@testing-library/jest-dom/vitest";

import Receipt from "../../../src/pages/orderingPage/Receipt";



// ==========================
// MOCK NAVIGATE
// ==========================

const mockNavigate = vi.fn();


vi.mock(
  "react-router-dom",
  async()=>{

    const actual =
      await vi.importActual(
        "react-router-dom"
      );

    return {
      ...actual,
      useNavigate:()=>mockNavigate
    };

  }
);



// ==========================
// LOCAL STORAGE MOCK
// ==========================

const localStorageMock = (()=>{

 let store={};


 return {

  getItem:vi.fn(
    key=>store[key] || null
  ),


  setItem:vi.fn(
    (key,value)=>{
      store[key]=value;
    }
  ),


  removeItem:vi.fn(
    key=>{
      delete store[key];
    }
  ),


  clear:vi.fn(
    ()=>{
      store={}
    }
  )

 };


})();



Object.defineProperty(
 global,
 "localStorage",
 {
  value:localStorageMock
 }
);



// ==========================
// MOCK DOWNLOAD API
// ==========================

global.URL.createObjectURL =
vi.fn(()=> "fake-url");



global.URL.revokeObjectURL =
vi.fn();



beforeEach(()=>{

 localStorage.clear();

 vi.clearAllMocks();


 localStorage.getItem.mockReturnValue(

 JSON.stringify({

   order:{
      order_number:"ORD-001",
      customer_name:"Michelle",
      customer_phone:"09123456789",
      grand_total:1000,
      payment_type:"deposit"
   },


   cartItems:[
    {
      name:"Chocolate Cake",
      price:500,
      quantity:2
    }
   ]

 })

 );


});



// ==========================
// TESTS
// ==========================


describe(
 "Receipt Component",
 ()=>{


it(
"should load order data from localStorage and render receipt",
()=>{


render(

 <MemoryRouter>
   <Receipt/>
 </MemoryRouter>

);



expect(
 screen.getByText("Order Placed!")
)
.toBeInTheDocument();



expect(
 screen.getByText("ORD-001")
)
.toBeInTheDocument();



expect(
 screen.getByText("Michelle")
)
.toBeInTheDocument();



expect(
 screen.getByText(/Chocolate Cake/i)
)
.toBeInTheDocument();



});





it(
"should disable navigation buttons before saving receipt",
()=>{


render(

 <MemoryRouter>
  <Receipt/>
 </MemoryRouter>

);



const orderAgain =
screen.getByRole(
 "button",
 {
  name:/Order Again/i
 }
);



expect(
 orderAgain
)
.toBeDisabled();



});







it(
"should download receipt and unlock buttons",
async()=>{


render(

 <MemoryRouter>
  <Receipt/>
 </MemoryRouter>

);



const downloadButton =
screen.getByRole(
 "button",
 {
  name:/Download E-Receipt/i
 }
);



fireEvent.click(
 downloadButton
);



await waitFor(()=>{


expect(
 screen.getByText(
  /Receipt Saved \/ Verified/i
 )
)
.toBeInTheDocument();



});



expect(
 screen.getByRole(
  "button",
  {
   name:/Order Again/i
  }
 )
)
.toBeEnabled();



});







it(
"should navigate after receipt is saved",
async()=>{


render(

 <MemoryRouter>
  <Receipt/>
 </MemoryRouter>

);



fireEvent.click(

 screen.getByRole(
  "button",
  {
   name:/Download E-Receipt/i
  }

)

);



await waitFor(()=>{


expect(
 screen.getByText(
 /Receipt Saved/i
 )
)
.toBeInTheDocument();


});



fireEvent.click(

screen.getByRole(
 "button",
 {
  name:/Order Again/i
 }
)

);



expect(
 mockNavigate
)
.toHaveBeenCalledWith(
 "/menu"
);



});







it(
"should remove orderData when navigating",
async()=>{


render(

 <MemoryRouter>
  <Receipt/>
 </MemoryRouter>

);



fireEvent.click(

screen.getByRole(
 "button",
 {
  name:/Download E-Receipt/i
 }
)

);



await waitFor(()=>{

expect(
 screen.getByText(
 /Receipt Saved/i
 )
)
.toBeInTheDocument();

});



fireEvent.click(

screen.getByRole(
 "button",
 {
  name:/Back to Home/i
 }
)

);



expect(
 localStorage.removeItem
)
.toHaveBeenCalledWith(
 "orderData"
);



});


});


