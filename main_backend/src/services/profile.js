'use strict';

const { userStore } = require('../data/store');

class ProfileService {
  getProfile(userId) {
    const user = userStore.findById(userId);
    if (!user) return null;
    const { passwordHash, ...safe } = user;
    return safe;
  }

  updateProfile(userId, { name, bio }) {
    const updated = userStore.update(userId, { name, bio });
    if (!updated) return null;
    const { passwordHash, ...safe } = updated;
    return safe;
  }
}

module.exports = new ProfileService();
