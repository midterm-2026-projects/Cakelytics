import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import POSPage from './pages/POSPage';
import { getToken, clearToken } from './services/api';
import * as authService from './services/authService';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Sidebar';

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

        <Route path="/pos" element={
          !isLoggedIn && !isIsolated
            ? <Navigate to="/login" replace />
            : <POSPage />
        } />

        <Route path="/*" element={
          !isLoggedIn && !isIsolated
            ? <Navigate to="/login" replace />
            : (
              <div style={{ padding: '2rem' }}>
                <h1>Login bypassed (Isolated Development Mode)</h1>
                <button onClick={handleLogout}>Logout</button>
                
                {/* Dito na pwedeng magdugtong ng mga sub-routes at pages ang mga kaklase mo */}
                {/* Halimbawa: <Routes><Route path="/ingredients" element={<RawIngredientsPage />} /></Routes> */}
              </div>
            )
        } />
      </Routes>
    </AppProvider>
  );
}
