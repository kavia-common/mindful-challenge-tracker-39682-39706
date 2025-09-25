'use strict';

/**
 * Centralized environment loader using dotenv.
 * Do not read .env directly elsewhere. Import from this module.
 */
const dotenv = require('dotenv');

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.AUTH_COOKIE_NAME || 'feelpain_token',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
};

module.exports = config;
