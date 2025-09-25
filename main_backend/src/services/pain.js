'use strict';

const { painStore } = require('../data/store');

class PainService {
  list(userId) {
    return painStore.listByUser(userId);
  }

  create(userId, payload) {
    return painStore.create({
      userId,
      intensity: payload.intensity,
      location: payload.location,
      description: payload.description || '',
      occurredAt: payload.occurredAt || null,
    });
  }

  get(userId, id) {
    return painStore.findByIdForUser(userId, id);
  }

  update(userId, id, payload) {
    return painStore.update(userId, id, {
      intensity: payload.intensity,
      location: payload.location,
      description: payload.description,
      occurredAt: payload.occurredAt,
    });
  }

  delete(userId, id) {
    return painStore.delete(userId, id);
  }
}

module.exports = new PainService();
