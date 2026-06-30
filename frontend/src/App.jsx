import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import POSPage from './pages/POSPage';
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
          <Route
            path="/admin-ui"
            element={
              <Layout onLogout={handleLogout}>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-brand-800">Layout Preview</h2>
                  <p className="text-sm text-brand-500 mt-1">
                  </p>
                </div>
              </Layout>
            }
          />
        )}

        {/* 3. CUSTOMER PAGES ONLY (Dito lang lilitaw ang Navbar at Footer) */}
        <Route path="/*" element={
          !isLoggedIn && !isIsolated
            ? <Navigate to="/login" replace />
            : (
              <div className="flex flex-col min-h-screen">
                {/* Isolated Mode Banner */}
                {isIsolated && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs p-2 text-center flex justify-between items-center px-4">
                    <span>Isolated Development Mode (Login Bypassed)</span>
                    <button className="underline font-bold" onClick={handleLogout}>Logout</button>
                  </div>
                )}

                {/* PARA SA CUSTOMER: Lilitaw ang Header dito */}
                <Navbar />

                {/* Dito nagpapalit-palit ang views ng Customer */}
                <main className="flex-grow">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/how-to-order" element={<HowToOrder />} />
                    <Route path="/orderprogress" element={<OrderProgress currentStep={1} />} />
                  </Routes>
                </main>

                {/* PARA SA CUSTOMER: Dito lang nakakabit ang Footer mo */}
                <Footer />
              </div>
            ) 
        } />
      </Routes>
    </AppProvider>
  );
}