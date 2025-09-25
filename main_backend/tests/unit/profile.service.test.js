'use strict';

const authService = require('../../src/services/auth');
const profileService = require('../../src/services/profile');

describe('ProfileService Unit', () => {
  function uniqueEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
  }

  test('getProfile returns public profile without passwordHash', async () => {
    const email = uniqueEmail();
    const { user } = await authService.register({ email, password: '123456', name: 'A', bio: 'B' });
    const profile = profileService.getProfile(user.id);
    expect(profile).toBeDefined();
    expect(profile.email).toBe(email.toLowerCase());
    expect(profile.passwordHash).toBeUndefined();
  });

  test('updateProfile updates name and bio', async () => {
    const email = uniqueEmail();
    const { user } = await authService.register({ email, password: '123456', name: 'Old', bio: 'Old bio' });
    const updated = profileService.updateProfile(user.id, { name: 'New', bio: 'New bio' });
    expect(updated.name).toBe('New');
    expect(updated.bio).toBe('New bio');
  });
});
