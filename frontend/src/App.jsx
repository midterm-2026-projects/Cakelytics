import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { getToken, clearToken } from './services/api';
import * as authService from './services/authService';

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
    <Routes>
      <Route
        path="/login"
        element={
          // Kung naka-login at HINDI naman isolated, tsaka lang siya ipagbabawal pumunta sa login page
          isLoggedIn && !isIsolated 
            ? <Navigate to="/" replace /> 
            : <LoginPage onLogin={handleLogin} />
        }
      />
      <Route path="/*" element={
        // KUNG HINDI naka-login at HINDI rin isolated, tsaka lang natin sila haharangin at ibabalik sa login
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
  );
}