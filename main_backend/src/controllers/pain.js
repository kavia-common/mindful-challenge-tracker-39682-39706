'use strict';

const { ok, created, error } = require('../utils/response');
const painService = require('../services/pain');

// PUBLIC_INTERFACE
function listPain(req, res) {
  /** List pain entries for the authenticated user. */
  const userId = req.user.id;
  const items = painService.list(userId);
  return ok(res, { items });
}

// PUBLIC_INTERFACE
function createPain(req, res) {
  /** Create a pain entry with validation. */
  const userId = req.user.id;
  const { intensity, location, description, occurredAt } = req.body || {};
  const parsedIntensity = Number(intensity);
  if (!location || Number.isNaN(parsedIntensity) || parsedIntensity < 1 || parsedIntensity > 10) {
    return error(res, 400, 'validation_failed', 'Intensity (1-10) and location are required.');
  }
  const createdEntry = painService.create(userId, { intensity: parsedIntensity, location, description, occurredAt });
  return created(res, { item: createdEntry });
}

// PUBLIC_INTERFACE
function getPain(req, res) {
  /** Get a single pain entry by id. */
  const userId = req.user.id;
  const { id } = req.params;
  const item = painService.get(userId, id);
  if (!item) return error(res, 404, 'not_found', 'Pain entry not found.');
  return ok(res, { item });
}

// PUBLIC_INTERFACE
function updatePain(req, res) {
  /** Update a pain entry. */
  const userId = req.user.id;
  const { id } = req.params;
  const { intensity, location, description, occurredAt } = req.body || {};
  const payload = {};
  if (typeof intensity !== 'undefined') {
    const parsed = Number(intensity);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > 10) {
      return error(res, 400, 'validation_failed', 'Intensity must be a number between 1 and 10.');
    }
    payload.intensity = parsed;
  }
  if (typeof location !== 'undefined') payload.location = location;
  if (typeof description !== 'undefined') payload.description = description;
  if (typeof occurredAt !== 'undefined') payload.occurredAt = occurredAt;

  const updated = painService.update(userId, id, payload);
  if (!updated) return error(res, 404, 'not_found', 'Pain entry not found.');
  return ok(res, { item: updated });
}

// PUBLIC_INTERFACE
function deletePain(req, res) {
  /** Delete a pain entry. */
  const userId = req.user.id;
  const { id } = req.params;
  const deleted = painService.delete(userId, id);
  if (!deleted) return error(res, 404, 'not_found', 'Pain entry not found.');
  return ok(res, { id, deleted: true });
}

module.exports = {
  listPain,
  createPain,
  getPain,
  updatePain,
  deletePain,
};
