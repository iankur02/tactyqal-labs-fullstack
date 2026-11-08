const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ACCESS_OPTIONS = { expiresIn: env.JWT_EXPIRES_IN };
const REFRESH_OPTIONS = { expiresIn: env.JWT_REFRESH_EXPIRES_IN };

function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, ACCESS_OPTIONS);
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.JWT_REFRESH_SECRET, REFRESH_OPTIONS);
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

/** Refresh cookie policy — httpOnly, scoped to auth routes, cross-site safe in prod. */
const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshCookieOptions,
};