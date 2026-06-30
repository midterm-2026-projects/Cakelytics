import { setToken, clearToken } from './api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function login(email, password) {
  // --- MOCK SIMULATION PARA SA BROWSER (KAPAG WALANG BACKEND) ---
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Base ito sa seed data ng iyong db.js
        if (email === 'admin@cakelytics.com' && password === '1234') {
          const fakeToken = 'mock-jwt-token-12345';
          setToken(fakeToken); 
          resolve({
            token: fakeToken,
            admin: { id: 'mock-id-1', name: 'Christine De Padua', email: 'admin@cakelytics.com' }
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  }
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || 'Login failed');
  }

  setToken(body.data.token);
  return body.data; 
}

export async function logout(token) {
  // --- MOCK LOGOUT ---
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return new Promise((resolve) => {
      setTimeout(() => {
        clearToken();
        resolve({ message: 'Logged out successfully' });
      }, 500);
    });
  }

  // --- TOTOONG LOGOUT ---
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  
  clearToken();
  return res.json();
}