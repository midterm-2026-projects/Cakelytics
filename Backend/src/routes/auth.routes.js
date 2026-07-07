const router = require('express').Router();
const { AuthController } = require('../controller/auth.controller');
const { authMiddlewareJwt } = require('../middleware/auth.middleware');

router.post('/login', AuthController.login);
router.post('/logout', authMiddlewareJwt, AuthController.logout);
router.get('/me', authMiddlewareJwt, AuthController.me);

module.exports = router;