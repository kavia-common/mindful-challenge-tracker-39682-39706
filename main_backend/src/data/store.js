'use strict';

/**
 * Simple in-memory data store to avoid external DB dependency.
 * This can be replaced by a real database layer later.
 */
const { v4: uuid } = require('uuid');

class UserStore {
  constructor() {
    this.users = new Map(); // key: id, value: user object
    this.emailIndex = new Map(); // key: email, value: id
  }

  create({ email, passwordHash, name = '', bio = '' }) {
    const id = uuid();
    const user = {
      id,
      email: email.toLowerCase(),
      passwordHash,
      name,
      bio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    this.emailIndex.set(user.email, id);
    return { ...user };
  }

  findByEmail(email) {
    const id = this.emailIndex.get((email || '').toLowerCase());
    if (!id) return null;
    return this.findById(id);
  }

  findById(id) {
    const u = this.users.get(id);
    return u ? { ...u } : null;
  }

  update(id, data) {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return { ...updated };
  }
}

class PainStore {
  constructor() {
    this.entries = new Map(); // key: id, value: entry
    this.byUser = new Map(); // key: userId, value: Set<entryId>
  }

  create({ userId, intensity, location, description = '', occurredAt = null }) {
    const id = uuid();
    const nowIso = new Date().toISOString();
    const entry = {
      id,
      userId,
      intensity, // 1-10
      location,
      description,
      occurredAt: occurredAt || nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    this.entries.set(id, entry);
    if (!this.byUser.has(userId)) this.byUser.set(userId, new Set());
    this.byUser.get(userId).add(id);
    return { ...entry };
  }

  listByUser(userId) {
    const ids = Array.from(this.byUser.get(userId) || []);
    return ids.map((id) => ({ ...this.entries.get(id) }));
  }

  findByIdForUser(userId, id) {
    const entry = this.entries.get(id);
    if (!entry || entry.userId !== userId) return null;
    return { ...entry };
  }

  update(userId, id, data) {
    const entry = this.entries.get(id);
    if (!entry || entry.userId !== userId) return null;
    const updated = {
      ...entry,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.entries.set(id, updated);
    return { ...updated };
  }

  delete(userId, id) {
    const entry = this.entries.get(id);
    if (!entry || entry.userId !== userId) return false;
    this.entries.delete(id);
    const set = this.byUser.get(userId);
    if (set) set.delete(id);
    return true;
  }
}

module.exports = {
  userStore: new UserStore(),
  painStore: new PainStore(),
};
