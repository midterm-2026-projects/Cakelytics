 const router = require('express').Router();
 const AuthController = require('../controller/auth.controller');
 const authMiddleware = require('../middleware/auth.middleware');

 router.post('/login', AuthController.login);
 router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;