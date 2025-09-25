'use strict';

const config = require('../config/env');
const authService = require('../services/auth');

/**
 * Extract bearer token from header or authentication cookie.
 */
function getTokenFromRequest(req) {
  const authHeader = req.get('authorization') || req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  if (req.cookies && req.cookies[config.cookieName]) {
    return req.cookies[config.cookieName];
  }
  return null;
}

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Enforces authenticated requests, attaches req.user if valid. */
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({
        status: 'error',
        theme: 'Ocean Professional',
        color: '#EF4444',
        code: 'auth_required',
        message: 'Authentication required.',
      });
    }
    const user = authService.verify(token);
    req.user = user;
    return next();
  } catch (e) {
    return res.status(e.status || 401).json({
      status: 'error',
      theme: 'Ocean Professional',
      color: '#EF4444',
      code: e.code || 'invalid_token',
      message: e.message || 'Invalid or expired token.',
    });
  }
}

module.exports = {
  requireAuth,
};
