// import HowToOrder from "../customerComponents/HowToOrder";

// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <>
//       {/* Hero Section */}
//       <section className="bg-[#F5F0EB] min-h-[85vh]">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center">

//           {/* Left Side */}
//           <div className="px-12 md:px-20">
//             <h1 className="text-6xl md:text-8xl font-serif text-[#6B5448] leading-tight">
//               Elevating
//               <br />
//               Everyday
//               <br />
//               Moments.
//             </h1>

//             <p className="mt-8 text-lg md:text-2xl text-[#6B5448] max-w-xl">
//               Discover our handcrafted cakes and pastries,
//               baked fresh daily using only the finest ingredients.
//             </p>

//             <button
//               onClick={() => navigate("/menu")}
//               className="mt-10 bg-[#4A1F00] hover:bg-[#3a1800] text-white px-10 py-4 tracking-widest transition"
//             >
//               EXPLORE MENU
//             </button>
//           </div>

//           {/* Right Side */}
//           <div>
//             <img
//               src="/cake-banner.jpg"
//               alt="Cake"
//               className="w-full h-[85vh] object-cover"
//             />
//           </div>

//         </div>
//       </section>
//     </>
//   );
// }

// import HowToOrder from "../../components/orderingComponents/HowToOrder";
// import PastCreations from "../../components/orderingComponents/PastCreations";
// import OrderCTA from "../../components/orderingComponents/OrderCTA";
// import FeaturedCategories from "../../components/orderingComponents/FeaturedCategories";

import Footer from "../../components/orderingComponents/Footer";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#F5F0EB] min-h-[85vh]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center">

          {/* Left Side */}
          <div className="px-12 md:px-20">
            <h1 className="text-6xl md:text-8xl font-serif text-[#6B5448] leading-tight">
              Elevating
              <br />
              Everyday
              <br />
              Moments.
            </h1>

            <p className="mt-8 text-lg md:text-2xl text-[#6B5448] max-w-xl">
              Discover our handcrafted cakes and pastries,
              baked fresh daily using only the finest ingredients.
            </p>

            <button
              onClick={() => navigate("/menu")}
              className="mt-10 bg-[#4A1F00] hover:bg-[#3a1800] text-white px-10 py-4 tracking-widest transition"
            >
              EXPLORE MENU
            </button>
          </div>

          {/* Right Side */}
          <div>
            <img
              src="/cake-banner.jpg"
              alt="Cake"
              className="w-full h-[85vh] object-cover"
            />
          </div>

        </div>
      </section>

      {/* Homepage Sections */}
      {/* <HowToOrder />
      <PastCreations />
      <OrderCTA />
      <FeaturedCategories /> */}
      <Footer/>
    </>
  );
}