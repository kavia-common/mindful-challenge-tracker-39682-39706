'use strict';

const config = require('../config/env');
const { ok, created, error } = require('../utils/response');
const authService = require('../services/auth');

// PUBLIC_INTERFACE
async function register(req, res) {
  /** Register a new user and set auth cookie. */
  try {
    const { email, password, name, bio } = req.body || {};
    if (!email || !password) {
      return error(res, 400, 'validation_failed', 'Email and password are required.', [
        { field: 'email', message: 'Required' },
        { field: 'password', message: 'Required' },
      ]);
    }
    const { user, token } = await authService.register({ email, password, name, bio });
    setAuthCookie(res, token);
    return created(res, { user });
  } catch (e) {
    return error(res, e.status || 400, e.code || 'registration_failed', e.message);
  }
}

// PUBLIC_INTERFACE
async function login(req, res) {
  /** Login user with email/password and set auth cookie. */
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return error(res, 400, 'validation_failed', 'Email and password are required.', [
        { field: 'email', message: 'Required' },
        { field: 'password', message: 'Required' },
      ]);
    }
    const { user, token } = await authService.login({ email, password });
    setAuthCookie(res, token);
    return ok(res, { user });
  } catch (e) {
    return error(res, e.status || 401, e.code || 'login_failed', e.message);
  }
}

// PUBLIC_INTERFACE
function logout(req, res) {
  /** Clear auth cookie to logout. */
  clearAuthCookie(res);
  return ok(res, { message: 'Logged out' });
}

function setAuthCookie(res, token) {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearAuthCookie(res) {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    path: '/',
  });
}

module.exports = {
  register,
  login,
  logout,
};
