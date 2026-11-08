const router = require('express').Router();
const validate = require('../middleware/validate');
const { loginSchema } = require('../validators/auth.validator');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { login, me, refresh, logout } = require('../controllers/auth.controller');

router.post('/login', authLimiter, validate({ body: loginSchema }), login);
router.get('/me', protect, me);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', logout);

module.exports = router;