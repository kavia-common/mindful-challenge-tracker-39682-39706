'use strict';

const { ok, error } = require('../utils/response');
const profileService = require('../services/profile');

// PUBLIC_INTERFACE
function getProfile(req, res) {
  /** Return current user's profile. */
  const userId = req.user.id;
  const profile = profileService.getProfile(userId);
  if (!profile) return error(res, 404, 'not_found', 'Profile not found.');
  return ok(res, { profile });
}

// PUBLIC_INTERFACE
function updateProfile(req, res) {
  /** Update profile fields (name, bio). */
  const userId = req.user.id;
  const { name, bio } = req.body || {};
  const updated = profileService.updateProfile(userId, { name, bio });
  if (!updated) return error(res, 404, 'not_found', 'Profile not found.');
  return ok(res, { profile: updated });
}

module.exports = {
  getProfile,
  updateProfile,
};
