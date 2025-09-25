'use strict';

const authService = require('../../src/services/auth');
const painService = require('../../src/services/pain');

describe('PainService Unit', () => {
  function uniqueEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
  }

  test('create/list/update/delete for a user and isolate from other users', async () => {
    const { user: u1 } = await authService.register({ email: uniqueEmail(), password: '123456' });
    const { user: u2 } = await authService.register({ email: uniqueEmail(), password: '123456' });

    const e1 = painService.create(u1.id, { intensity: 5, location: 'head' });
    const e2 = painService.create(u1.id, { intensity: 6, location: 'back' });
    painService.create(u2.id, { intensity: 7, location: 'leg' });

    const listU1 = painService.list(u1.id);
    const listU2 = painService.list(u2.id);

    expect(listU1.map(e => e.id).sort()).toEqual([e1.id, e2.id].sort());
    expect(listU2.length).toBe(1);

    const got = painService.get(u1.id, e1.id);
    expect(got).toBeDefined();
    expect(got.userId).toBe(u1.id);

    const updated = painService.update(u1.id, e1.id, { intensity: 8, description: 'updated' });
    expect(updated.intensity).toBe(8);
    expect(updated.description).toBe('updated');

    // Cross user update should fail
    const crossUpdate = painService.update(u2.id, e1.id, { intensity: 3 });
    expect(crossUpdate).toBeNull();

    const del = painService.delete(u1.id, e2.id);
    expect(del).toBe(true);

    const delAgain = painService.delete(u1.id, e2.id);
    expect(delAgain).toBe(false);
  });
});
