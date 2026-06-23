const crypto = require('crypto');
const { TABLES } = require('../config/db');

const activeSessions = new Map();

const MOCK_CREDENTIALS = {
  'admin@cakelytics.com': '1234',
};

function genToken() {
  return crypto.randomBytes(24).toString('hex');
}

function login(email, password) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const storedPassword = MOCK_CREDENTIALS[email];
  const admin = TABLES.admins.find((a) => a.email === email);

  if (!storedPassword || !admin || storedPassword !== password) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const token = genToken();
  activeSessions.set(token, {
    adminId: admin.id,
    email: admin.email,
    issuedAt: Date.now(),
  });

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email },
  };
}

function logout(token) {
  if (!token || !activeSessions.has(token)) {
    return false;
  }
  activeSessions.delete(token);
  return true;
}

function verifyToken(token) {
  return activeSessions.get(token) || null;
}

module.exports = { login, logout, verifyToken };