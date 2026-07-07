// // import { useState } from 'react';
// // import { Routes, Route, Navigate } from 'react-router-dom';
// // import LoginPage from './pages/LoginPage';
// // import POSPage from './pages/PosPage/POSPage';
// // import Home from './pages/orderingPage/Home';
// // import Menu from './pages/orderingPage/Menu';
// // import { getToken, clearToken } from './services/api';
// // import * as authService from './services/authService';
// // import { AppProvider } from './context/AppContext';
// // import { Layout } from './components/Sidebar';

// // import Navbar from "./components/orderingComponents/Navbar";
// // import HowToOrder from "./components/orderingComponents/HowToOrder";
// // import OrderProgress from "./components/orderingComponents/OrderProgress";
// // import Footer from "./components/orderingComponents/Footer";
// // import PastCreations from "./components/orderingComponents/PastCreations";
// // import FeaturedCategories from "./components/orderingComponents/FeaturedCategories";
// // import Cart from "./components/orderingComponents/Cart";
// // import OrderCTA from "./components/orderingComponents/OrderCTA";
// // import CategoryFilters from "./components/orderingComponents/CategoryFilters";

// // import Checkout from './pages/orderingPage/Checkout';
// // import Complete from './pages/orderingPage/Complete';
// // import Payment from './pages/orderingPage/Payment';
// // import Receipt from './pages/orderingPage/Receipt';

// // import FourKpi from './components/Analytics/fourKPI';
// // import PerformanceTimeframe from './components/Analytics/performanceTimeframe';
// // import StackedBar from './components/Analytics/stackedBar';

// // import OrderVolumeHeatmap from './components/Analytics/heatmap';
// // import TopProductsList from './components/Analytics/topProducts';
// // import ForecastTimeframe from './components/Analytics/forecastTimeframe'
// // import SalesForecast from './components/Analytics/salesForecast'
// // import ProductForecasting from './components/Analytics/productForecast'
// // import ActionableRecommendation from './components/Analytics/actionableRecommendation'

// // import AllOrdersPage from './pages/AllOrdersPage/AllOrdersPage';
// // import ProductManagementPage from './pages/ProductManagementPage/ProductManagementPage';

// // export default function App() {

// //   const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());

// //   // Titingnan kung kasalukuyang naka-isolated/mock mode ang app base sa .env
// //   const isIsolated = import.meta.env.VITE_USE_MOCK_API === 'true';

// //   const handleLogin  = () => setIsLoggedIn(true);
// //   const handleLogout = () => {
// //     authService.logout(getToken());
// //     clearToken();
// //     setIsLoggedIn(false);
// //   };

// //   return (
// //     <AppProvider>
// //       <Routes>
// //         <Route
// //           path="/login"
// //           element={
// //             isLoggedIn && !isIsolated 
// //               ? <Navigate to="/" replace /> 
// //               : <LoginPage onLogin={handleLogin} />
// //           }
// //         />
// //         {isIsolated && (
// //           <>
// //             {/* 1. Layout Preview ng Kaklase Mo */}
// //             <Route
// //               path="/admin-ui"
// //               element={
// //                 <Layout onLogout={handleLogout}>
// //                   <div className="p-4">
// //                     <h2 className="text-lg font-bold text-brand-800">Layout Preview</h2>
// //                   </div>
// //                 </Layout>
// //               }
// //             />


// //           {/* Independent Routes for Week 2 - Day 1 AI-Driven Analytics Dashboard */}
// //           <Route path="/performanceTimeframe" element={<div className="p-6 bg-stone-50 min-h-screen"><PerformanceTimeframe /></div>} />
// //           <Route path="/four-kpi" element={<div className="p-6 bg-stone-50 min-h-screen"><FourKpi /></div>} />
// //           <Route path="/stackedBar" element={<div className="p-6 bg-stone-50 min-h-screen"><StackedBar /></div>} />
// //           <Route path="/heatmap" element={<div className="p-6 bg-stone-50 min-h-screen"><OrderVolumeHeatmap /></div>} />
// //           <Route path="/topproducts" element={<div className="p-6 bg-stone-50 min-h-screen"><TopProductsList /></div>} />
// //           <Route path="/forecastTimeframe" element={<div className="p-6 bg-stone-50 min-h-screen"><ForecastTimeframe /></div>} />
// //           <Route path="/salesForecast" element={<div className="p-6 bg-stone-50 min-h-screen"><SalesForecast /></div>} />
// //           <Route path="/productForecast" element={<div className="p-6 bg-stone-50 min-h-screen"><ProductForecasting /></div>} />
// //           <Route path="/recommendation" element={<div className="p-6 bg-stone-50 min-h-screen"><ActionableRecommendation /></div>} />
// //           <Route path="/pos" element={<POSPage />} />
// //           <Route path="/all-orders" element={<AllOrdersPage />} />
// //           <Route path="/product-management" element={<ProductManagementPage />} />
// //         </>
// //         )}

// //         {/* 3. CUSTOMER PAGES ONLY (Dito lang lilitaw ang Navbar at Footer) */}
// //         <Route path="/*" element={
// //           !isLoggedIn && !isIsolated
// //             ? <Navigate to="/login" replace />
// //             : (
// //               <div className="flex flex-col min-h-screen">
// //                 {/* Isolated Mode Banner */}
// //                 {isIsolated && (
// //                   <div className="bg-yellow-100 text-yellow-800 text-xs p-2 text-center flex justify-between items-center px-4">
// //                     <span>Isolated Development Mode (Login Bypassed)</span>
// //                     <button className="underline font-bold" onClick={handleLogout}>Logout</button>
// //                   </div>
// //                 )}

// //                 {/* PARA SA CUSTOMER: Lilitaw ang Header dito */}
// //                 <Navbar />

// //                 {/* Dito nagpapalit-palit ang views ng Customer */}
// //                 <main className="flex-grow">
// //                   <Routes>
// //                     <Route path="/" element={<Home />} />
// //                     <Route path="/menu" element={<Menu />} />
// //                     <Route path="/how-to-order" element={<HowToOrder />} />
// //                     <Route path="/past-creations" element={<PastCreations />} />
// //                     <Route path="/featured-categories" element={<FeaturedCategories />} />
// //                     {/* <Route path="/cart" element={<Cart />} /> */}
// //                     <Route path="/cart" element={<Cart />} />
// //                     <Route path="/order-cta" element={<OrderCTA />} />
// //                     <Route path="/categoryfilters" element={<CategoryFilters/>}/>
// //                     <Route path="/checkout" element={<Checkout />} />
// //                     <Route path="/complete" element={<Complete />} />
// //                     <Route path="/payment" element={<Payment />} />
// //                     <Route path="/receipt" element={<Receipt />} />
// //                     <Route path="/orderprogress" element={<OrderProgress currentStep={1} />} />
// //                   </Routes>
// //                 </main>

// //                 {/* PARA SA CUSTOMER: Dito lang nakakabit ang Footer mo */}
// //                 <Footer />
// //               </div>
// //             ) 
// //         } />
// //       </Routes>
// //     </AppProvider>
// //   );
// // }
// import { useState } from 'react';
// import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import POSPage from './pages/PosPage/POSPage';
// import Home from './pages/orderingPage/Home';
// import Menu from './pages/orderingPage/Menu';
// import { getToken, clearToken } from './services/api';
// import * as authService from './services/authService';
// import { AppProvider } from './context/AppContext';
// import { Layout } from './components/Sidebar';

// import Navbar from "./components/orderingComponents/Navbar";
// import HowToOrder from "./components/orderingComponents/HowToOrder";
// import OrderProgress from "./components/orderingComponents/OrderProgress";
// import Footer from "./components/orderingComponents/Footer";
// import PastCreations from "./components/orderingComponents/PastCreations";
// import FeaturedCategories from "./components/orderingComponents/FeaturedCategories";
// import Cart from "./components/orderingComponents/Cart";
// import OrderCTA from "./components/orderingComponents/OrderCTA";
// import CategoryFilters from "./components/orderingComponents/CategoryFilters";

// import Checkout from './pages/orderingPage/Checkout';
// import Complete from './pages/orderingPage/Complete';
// import Payment from './pages/orderingPage/Payment';
// import Receipt from './pages/orderingPage/Receipt';
// import ScrollToTop from "./components/orderingComponents/ScrollToTop";

// import FourKpi from './components/Analytics/fourKPI';
// import PerformanceTimeframe from './components/Analytics/performanceTimeframe';
// import StackedBar from './components/Analytics/stackedBar';

// import OrderVolumeHeatmap from './components/Analytics/heatmap';
// import TopProductsList from './components/Analytics/topProducts';

// import AllOrdersPage from './pages/AllOrdersPage/AllOrdersPage';
// import ProductManagementPage from './pages/ProductManagementPage/ProductManagementPage';

// export default function App() {

//   const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());

//   // Titingnan kung kasalukuyang naka-isolated/mock mode ang app base sa .env
//   const isIsolated = import.meta.env.VITE_USE_MOCK_API === 'true';

//   const handleLogin  = () => setIsLoggedIn(true);
//   const handleLogout = () => {
//     authService.logout(getToken());
//     clearToken();
//     setIsLoggedIn(false);
//   };

//   return (
//     <AppProvider>
//       <Routes>
//         <Route
//           path="/login"
//           element={
//             isLoggedIn && !isIsolated 
//               ? <Navigate to="/" replace /> 
//               : <LoginPage onLogin={handleLogin} />
//           }
//         />
//         {isIsolated && (
//           <>
//             {/* 1. Layout Preview ng Kaklase Mo */}
//             <Route
//               path="/admin-ui"
//               element={
//                 <Layout onLogout={handleLogout}>
//                   <div className="p-4">
//                     <h2 className="text-lg font-bold text-brand-800">Layout Preview</h2>
//                   </div>
//                 </Layout>
//               }
//             />


//           {/* Independent Routes for Week 2 - Day 1 AI-Driven Analytics Dashboard */}
//           <Route path="/performanceTimeframe" element={<div className="p-6 bg-stone-50 min-h-screen"><PerformanceTimeframe /></div>} />
//           <Route path="/four-kpi" element={<div className="p-6 bg-stone-50 min-h-screen"><FourKpi /></div>} />
//           <Route path="/stackedBar" element={<div className="p-6 bg-stone-50 min-h-screen"><StackedBar /></div>} />
//           <Route path="/heatmap" element={<div className="p-6 bg-stone-50 min-h-screen"><OrderVolumeHeatmap /></div>} />
//           <Route path="/topproducts" element={<div className="p-6 bg-stone-50 min-h-screen"><TopProductsList /></div>} />
//           <Route path="/pos" element={<POSPage />} />
//           <Route path="/all-orders" element={<AllOrdersPage />} />
//         </>
//         )}

//        {/* 3. CUSTOMER PAGES ONLY (Dito lang lilitaw ang Navbar at Footer) */}
//         <Route
//           path="/*"
//           element={
//             <div className="flex flex-col min-h-screen">

//               <ScrollToTop />
//               <Navbar />

//               <main className="flex-grow">
//                 <Outlet />
//               </main>
//             </div>
//           }
//         >
//           <Route index element={<Home />} />
//           <Route path="menu" element={<Menu />} />
//           <Route path="how-to-order" element={<HowToOrder />} />
//           <Route path="past-creations" element={<PastCreations />} />
//           <Route path="featured-categories" element={<FeaturedCategories />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="order-cta" element={<OrderCTA />} />
//           <Route path="categoryfilters" element={<CategoryFilters />} />
//           <Route path="checkout" element={<Checkout />} />
//           <Route path="complete" element={<Complete />} />
//           <Route path="payment" element={<Payment />} />
//           <Route path="receipt" element={<Receipt />} />
//           <Route path="product-management" element={<ProductManagementPage />} />
//           <Route
//             path="orderprogress"
//             element={<OrderProgress currentStep={1} />}
//           />
//         </Route>
//       </Routes>
//       </AppProvider>
//   );
// }

import { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import POSPage from './pages/PosPage/POSPage';
import Home from './pages/orderingPage/Home';
import Menu from './pages/orderingPage/Menu';
import { getToken, clearToken } from './services/api';
import * as authService from './services/authService';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Sidebar';

import Navbar from "./components/orderingComponents/Navbar";
import HowToOrder from "./components/orderingComponents/HowToOrder";
import OrderProgress from "./components/orderingComponents/OrderProgress";
import Footer from "./components/orderingComponents/Footer";
import PastCreations from "./components/orderingComponents/PastCreations";
import FeaturedCategories from "./components/orderingComponents/FeaturedCategories";
import Cart from "./components/orderingComponents/Cart";
import OrderCTA from "./components/orderingComponents/OrderCTA";
import CategoryFilters from "./components/orderingComponents/CategoryFilters";

import Checkout from './pages/orderingPage/Checkout';
import Complete from './pages/orderingPage/Complete';
import Payment from './pages/orderingPage/Payment';
import Receipt from './pages/orderingPage/Receipt';
import ScrollToTop from "./components/orderingComponents/ScrollToTop";

import FourKpi from './components/Analytics/fourKPI';
import PerformanceTimeframe from './components/Analytics/performanceTimeframe';
import StackedBar from './components/Analytics/stackedBar';

import OrderVolumeHeatmap from './components/Analytics/heatmap';
import TopProductsList from './components/Analytics/topProducts';

import AllOrdersPage from './pages/AllOrdersPage/AllOrdersPage';
import ProductManagementPage from './pages/ProductManagementPage/ProductManagementPage';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());

  // Titingnan kung kasalukuyang naka-isolated/mock mode ang app base sa .env
  const isIsolated = import.meta.env.VITE_USE_MOCK_API === 'true';

  const handleLogin  = () => setIsLoggedIn(true);
  const handleLogout = () => {
    authService.logout(getToken());
    clearToken();
    setIsLoggedIn(false);
  };

  return (
    <AppProvider>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn && !isIsolated 
              ? <Navigate to="/" replace /> 
              : <LoginPage onLogin={handleLogin} />
          }
        />
        {isIsolated && (
          <>
            {/* 1. Layout Preview ng Kaklase Mo */}
            <Route
              path="/admin-ui"
              element={
                <Layout onLogout={handleLogout}>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-brand-800">Layout Preview</h2>
                  </div>
                </Layout>
              }
            />


          {/* Independent Routes for Week 2 - Day 1 AI-Driven Analytics Dashboard */}
          <Route path="/performanceTimeframe" element={<div className="p-6 bg-stone-50 min-h-screen"><PerformanceTimeframe /></div>} />
          <Route path="/four-kpi" element={<div className="p-6 bg-stone-50 min-h-screen"><FourKpi /></div>} />
          <Route path="/stackedBar" element={<div className="p-6 bg-stone-50 min-h-screen"><StackedBar /></div>} />
          <Route path="/heatmap" element={<div className="p-6 bg-stone-50 min-h-screen"><OrderVolumeHeatmap /></div>} />
          <Route path="/topproducts" element={<div className="p-6 bg-stone-50 min-h-screen"><TopProductsList /></div>} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/all-orders" element={<AllOrdersPage />} />
        </>
        )}

       {/* 3. CUSTOMER PAGES ONLY (Dito lang lilitaw ang Navbar at Footer) */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">

              <ScrollToTop />
              <Navbar />

              <main className="flex-grow">
                <Outlet />
              </main>
            </div>
          }
        >
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="how-to-order" element={<HowToOrder />} />
          <Route path="past-creations" element={<PastCreations />} />
          <Route path="featured-categories" element={<FeaturedCategories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="order-cta" element={<OrderCTA />} />
          <Route path="categoryfilters" element={<CategoryFilters />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="complete" element={<Complete />} />
          <Route path="payment" element={<Payment />} />
          <Route path="receipt" element={<Receipt />} />
          
          <Route
            path="orderprogress"
            element={<OrderProgress currentStep={1} />}
          />
        </Route>
      </Routes>
      </AppProvider>
  );
}