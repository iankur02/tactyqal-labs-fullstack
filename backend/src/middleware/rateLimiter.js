const { rateLimit } = require('express-rate-limit');
const env = require('../config/env');

const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please try again later.' },
});

// Auth limit is tight in production (10 attempts / 15m) to slow credential
// stuffing. In tests the shared in-memory store accumulates every login
// across the whole test file, so a real production limit would starve
// legitimate test calls. Lift it — the auth limiter's behavior is exercised
// separately by a dedicated rate-limit integration test in a follow-up.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'test' ? 10_000 : 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts — try again in 15 minutes.' },
});

module.exports = { globalLimiter, authLimiter };