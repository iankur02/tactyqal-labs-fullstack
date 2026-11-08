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

// A bcrypt hash of a random string — never matches a real password.
// Its only purpose is to burn CPU time so a "user not found" response
// takes the same length of time as a "wrong password" response.
const DUMMY_HASH = '$2a$12$C7pS.7FJFRGKlNaLPK1RVe3W3YzXFKv1r6l/v1X3Nqh5C0Y6LyN6q';

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const stored = user?.password || DUMMY_HASH;
  const ok = await bcrypt.compare(password, stored);

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