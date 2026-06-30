// src/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import POSPage from './pages/POSPage';
import { getToken, clearToken } from './services/api';
import * as authService from './services/authService';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Sidebar';
import Navbar from "./components/Navbar";
import HowToOrder from "./components/HowToOrder";
import OrderProgress from "./components/OrderProgress";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";

// Safe imports ng iyong limang sub-pages
import RawTab from "./components/inventory/RawTab";
import CelebrationTab from "./components/inventory/CelebrationTab";
import RecipeTab from "./components/inventory/RecipeTab";
import ProductLogTab from "./components/inventory/ProductLogTab";
import WasteTab from "./components/inventory/WasteTab";

// ── SAFE GLOBAL BYPASS ──
// Direktang sinasaksakan ng empty function ang kahit anong tawag sa toast para hindi mag-crash ang mga tabs
window.useToast = () => ({
  toast: () => {}, success: () => {}, error: () => {}, warning: () => {}, info: () => {}
});

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
        {/* 1. PUBLIC CUSTOMER PAGES (Kahit sino pwedeng pumasok, walang login-login!) */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              {/* Lalabas lang 'to kapag naka-mock mode ka para alam mo */}
              {/* {isIsolated && (
                <div className="bg-yellow-100 text-yellow-800 text-xs p-2 text-center flex justify-between items-center px-4">
                  <span>Isolated Development Mode (Login Bypassed)</span>
                  <button className="underline font-bold" onClick={handleLogout}>Logout</button>
                </div>
              )} */}

              <Navbar />
              <main className="grow">
                <Routes>
                  {/* Default lander papuntang Home */}
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/how-to-order" element={<HowToOrder />} />
                  <Route path="/orderprogress" element={<OrderProgress currentStep={1} />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* 2. LOGIN PAGE (Para sa Admin/Staff lang talaga dapat) */}
        <Route
          path="/login"
          element={
            isLoggedIn && !isIsolated 
              ? <Navigate to="/admin-ui" replace /> // Pag naka-login, itapon sa admin dashboard, hindi sa customer home!
              : <LoginPage onLogin={handleLogin} />
          }
        />
        
        {/* 3. ISOLATED SIMULATION ROUTES (Pang-test mo ng admin components) */}
        {isIsolated && (
          <>
            {/* Layout Preview ng Kaklase Mo */}
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

            {/* Isolated Independent Routes para sa mga Inventory Sub-pages mo */}
            <Route path="/inventory-test/raw" element={<div className="p-6 bg-stone-50 min-h-screen"><RawTab /></div>} />
            <Route path="/inventory-test/celeb" element={<div className="p-6 bg-stone-50 min-h-screen"><CelebrationTab /></div>} />
            <Route path="/inventory-test/recipe" element={<div className="p-6 bg-stone-50 min-h-screen"><RecipeTab /></div>} />
            <Route path="/inventory-test/product" element={<div className="p-6 bg-stone-50 min-h-screen"><ProductLogTab /></div>} />
            <Route path="/inventory-test/waste" element={<div className="p-6 bg-stone-50 min-h-screen"><WasteTab /></div>} />
          </>
        )}
      </Routes>
    </AppProvider>
  );
}