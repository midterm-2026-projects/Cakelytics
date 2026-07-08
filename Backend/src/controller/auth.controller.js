const { ok, fail } = require('../utils/response.js');
const { LoginSchema } = require('../schemas/index.js');

const AuthController = {

  login: async (req, res, next) => {
    try {
      const body   = LoginSchema.parse(req.body);
      const result = await AuthService.login(body.email, body.password);
      ok(res, result, 'Login successful');
    } catch (err) {
      if (err.message?.toLowerCase().includes('credential') || 
          err.message?.toLowerCase().includes('password') || 
          err.message?.toLowerCase().includes('invalid')) {
        return res.status(401).json({ success: false, message: err.message });
      }
      next(err); }
  },

  logout: (_req, res) => ok(res, null, 'Logged out'),

  me: async (req, res, next) => {
    try {
      const admin = await AuthService.getProfile(req.admin.id);
      ok(res, admin);
    } catch (err) { next(err); }
  },

};

module.exports = { AuthController };