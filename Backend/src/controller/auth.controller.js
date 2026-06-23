const authService = require('../services/auth.service');
const { ok } = require('../utils/response');

const AuthController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      ok(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      await authService.logout(token);
      ok(res, null, 'Logged out');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;