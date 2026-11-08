const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} = require('../utils/jwt');

// A known-valid bcrypt hash of the word "password".
// Used to prevent timing attacks: we compare against this if the user isn't found,
// so the response time is identical whether the email exists or not.
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const stored = user?.password || DUMMY_HASH;
  
  let ok = false;
  try {
    ok = await bcrypt.compare(password, stored);
  } catch (err) {
    // If bcrypt fails for any reason, just treat it as a bad password
    ok = false;
  }

  if (!user || !ok) return next(new AppError('Invalid credentials', 401));

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
  return success(res, {
    message: 'Logged in',
    data: { accessToken, user: user.toSafeJSON() },
  });
});

const me = catchAsync(async (req, res) => {
  return success(res, { data: { user: req.user.toSafeJSON() } });
});

const refresh = catchAsync(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) return next(new AppError('No refresh token', 401));

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  const user = await User.findById(decoded.sub);
  if (!user) return next(new AppError('User no longer exists', 401));

  const accessToken = signAccessToken(user);
  const newRefresh = signRefreshToken(user);
  res.cookie('refreshToken', newRefresh, refreshCookieOptions);

  return success(res, { data: { accessToken, user: user.toSafeJSON() } });
});

const logout = catchAsync(async (_req, res) => {
  res.clearCookie('refreshToken', { ...refreshCookieOptions, maxAge: 0 });
  return success(res, { message: 'Logged out' });
});

module.exports = { login, me, refresh, logout };