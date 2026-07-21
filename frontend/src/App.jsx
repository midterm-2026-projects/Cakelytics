import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getToken } from './services/api'; 

import LoginPage from './pages/LoginPage';
import POSPage from './pages/PosPage/POSPage';
import AllOrdersPage from './pages/AllOrdersPage/AllOrdersPage';
import ProductManagementPage from './pages/ProductManagementPage/ProductManagementPage';

import Home from './pages/orderingPage/Home';
import Menu from './pages/orderingPage/Menu';
import Checkout from './pages/orderingPage/Checkout';
import Complete from './pages/orderingPage/Complete';
import Payment from './pages/orderingPage/Payment';
import Receipt from './pages/orderingPage/Receipt';

import Navbar from './components/orderingComponents/Navbar';
import Footer from './components/orderingComponents/Footer';
import HowToOrder from './components/orderingComponents/HowToOrder';
import OrderProgress from './components/orderingComponents/OrderProgress';
import PastCreations from './components/orderingComponents/PastCreations';
import FeaturedCategories from './components/orderingComponents/FeaturedCategories';
import Cart from './components/orderingComponents/Cart';
import OrderCTA from './components/orderingComponents/OrderCTA';
import CategoryFilters from './components/orderingComponents/CategoryFilters';

import AnalyticsPage from './pages/analyticsPage'

import InventoryPage from './pages/InventoryPage';

import { ToastProvider } from './components/ui/index';
import { Layout } from './components/Sidebar';
import { AppProvider } from './context/AppContext';

// Simpleng wrapper para lang sa page preview
function PagePreview({ children }) {
  return <div className="p-6 bg-stone-50 min-h-screen">{children}</div>;
}

//  ITO YUNG BYPASS SWITCH MO 
const BYPASS_LOGIN = false;

//  ITO ANG PROTECTOR NG MGA ADMIN PAGES
function ProtectedAdminRoute({ children }) {
   const isAuthenticated =
    import.meta.env.MODE === 'test' ? true : (BYPASS_LOGIN || !!getToken());  // ← BINAGO
  
  //  IDINAGDAG: Kukunin natin si navigate para magamit sa logout
  const navigate = useNavigate(); 

  if (!isAuthenticated) {
    // Kung hindi allowed, ibato pabalik sa login page
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    console.log("Logout clicked!");
    
    //  IDINAGDAG: Ibabato ka na pabalik sa login kapag pinindot
    navigate('/login', { replace: true }); 
  };

  // Kung allowed, i-render ang Layout (Sidebar) at yung mismong pinapasok na component
  return <Layout onLogout={handleLogout}>{children}</Layout>;
}

export default function App() {
  //  IDINAGDAG: Magagamit natin ito para i-redirect ang user pagkatapos mag-login
  const navigate = useNavigate();

  return (
    <AppProvider>
      <ToastProvider>
        <Routes>

          {/* ── CUSTOMER SIDE (Public - Walang Sidebar, Bawal Maharang) ── */}
          {/* Dito papalitan niyo kung ano yung final routes niyo */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/how-to-order" element={<HowToOrder />} />
          <Route path="/past-creations" element={<PastCreations />} />
          <Route path="/featured-categories" element={<FeaturedCategories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-cta" element={<OrderCTA />} />
          <Route path="/category-filters" element={<CategoryFilters />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/order-progress" element={<OrderProgress currentStep={1} />} />

          {/* SHARED LAYOUT PREVIEW (may Navbar + Footer) */}
          <Route
            path="/preview-with-layout"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />

          {/* ── AUTHENTICATION ── */}
          {/* Kapag nag-trigger yung onLogin, didiretso siya sa /inventory */}
          <Route path="/login" element={<LoginPage onLogin={() => navigate('/inventory')} />} />

          {/* yung all orders tsaka products ito ang sundin niyong final endpoint, palitan niyo na lang yung path na garne kasi sa inventory sya nakaturo <InventoryPage />  */}
          <Route path="/orders" element={<ProtectedAdminRoute><InventoryPage /></ProtectedAdminRoute>} />
          <Route path="/products" element={<ProtectedAdminRoute><InventoryPage /></ProtectedAdminRoute>} />

          {/* ── ADMIN / POS PAGES (Private - Nakabalot sa ProtectedAdminRoute) ── */}
          <Route path="/pos" element={<ProtectedAdminRoute><POSPage /></ProtectedAdminRoute>} />
          <Route path="/all-orders" element={<ProtectedAdminRoute><AllOrdersPage /></ProtectedAdminRoute>} />
          <Route path="/product-management" element={<ProtectedAdminRoute><ProductManagementPage /></ProtectedAdminRoute>} />

          {/* ── INVENTORY PAGES (Private) ── */}
          <Route path="/inventory" element={<ProtectedAdminRoute><InventoryPage /></ProtectedAdminRoute>} />

          {/* ── ANALYTICS PAGES (Private) ── */}
          <Route path="/analytics" element={<ProtectedAdminRoute><AnalyticsPage /></ProtectedAdminRoute>} />

          {/* 404 */}
            <Route 
            path="*" 
            element={
              <div className="flex flex-col items-center justify-center min-h-screen text-center bg-stone-50">
                <h1 className="text-4xl font-bold text-red-500 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-stone-800 mb-4">Page Not Found</h2>
                <p className="text-stone-500 mb-6">Sorry, the page you are looking for does not exist.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-bold"
                >
                  Go Back Home
                </button>
              </div>
            } 
          />


            <Route 
            path="*" 
            element={
              <div className="flex flex-col items-center justify-center min-h-screen text-center bg-stone-50">
                <h1 className="text-4xl font-bold text-red-500 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-stone-800 mb-4">Page Not Found</h2>
                <p className="text-stone-500 mb-6">Sorry, the page you are looking for does not exist.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-bold"
                >
                  Go Back Home
                </button>
              </div>
            } 
          />
          

        </Routes>
      </ToastProvider>
    </AppProvider>
  );
}