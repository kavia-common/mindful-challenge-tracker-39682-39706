'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { userStore } = require('../data/store');

class AuthService {
  /**
   * Register a new user.
   */
  async register({ email, password, name = '', bio = '' }) {
    const existing = userStore.findByEmail(email);
    if (existing) {
      const err = new Error('Email already registered');
      err.code = 'email_in_use';
      err.status = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = userStore.create({ email, passwordHash, name, bio });
    const token = this._sign(user.id);
    return { user: this._publicUser(user), token };
  }

  /**
   * Login user with email/password.
   */
  async login({ email, password }) {
    const user = userStore.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.code = 'invalid_credentials';
      err.status = 401;
      throw err;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid credentials');
      err.code = 'invalid_credentials';
      err.status = 401;
      throw err;
    }
    const token = this._sign(user.id);
    return { user: this._publicUser(user), token };
  }

  /**
   * Verify token and return user.
   */
  verify(token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = userStore.findById(payload.sub);
      if (!user) {
        const err = new Error('User not found');
        err.code = 'user_not_found';
        err.status = 401;
        throw err;
      }
      return { ...this._publicUser(user) };
    } catch (e) {
      const err = new Error('Invalid or expired token');
      err.code = 'invalid_token';
      err.status = 401;
      throw err;
    }
  }

  _sign(userId) {
    return jwt.sign(
      { sub: userId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  _publicUser(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}

module.exports = new AuthService();
