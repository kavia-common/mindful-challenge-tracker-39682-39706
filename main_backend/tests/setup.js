'use strict';

const { userStore, painStore } = require('../src/data/store');

// Ensure clean state before each test
beforeEach(() => {
  userStore.users.clear();
  userStore.emailIndex.clear();
  painStore.entries.clear();
  painStore.byUser.clear();
});
