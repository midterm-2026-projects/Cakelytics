// src/services/api.js
//
// Centralized helpers para sa pag-manage ng auth token sa localStorage.
// Ginagamit ito ng App.jsx at ng authService.js (kung kailangan).

const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}