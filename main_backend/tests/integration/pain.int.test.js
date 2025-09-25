'use strict';

const request = require('supertest');
const app = require('../../src/app');

describe('Pain Integration', () => {
  function uniqueEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
  }

  test('GET /pain - unauthorized returns 401', async () => {
    const res = await request(app).get('/pain');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('auth_required');
  });

  test('Full pain CRUD flow with validations', async () => {
    const agent = request.agent(app);
    const email = uniqueEmail();
    await agent.post('/auth/register').send({ email, password: 'Secret123!' });

    // Initially empty
    const listEmpty = await agent.get('/pain');
    expect(listEmpty.status).toBe(200);
    expect(listEmpty.body.data.items).toEqual([]);

    // Validation errors
    const invalidMissing = await agent.post('/pain').send({ intensity: 5 }); // missing location
    expect(invalidMissing.status).toBe(400);
    expect(invalidMissing.body.code).toBe('validation_failed');

    const invalidRange = await agent.post('/pain').send({ intensity: 11, location: 'head' });
    expect(invalidRange.status).toBe(400);
    expect(invalidRange.body.code).toBe('validation_failed');

    // Create valid entry
    const created = await agent.post('/pain').send({
      intensity: 7,
      location: 'knee',
      description: 'sore',
    });
    expect(created.status).toBe(201);
    const createdItem = created.body.data.item;
    expect(createdItem.id).toBeDefined();

    // List should include created
    const list = await agent.get('/pain');
    expect(list.status).toBe(200);
    expect(list.body.data.items.length).toBe(1);
    expect(list.body.data.items[0].id).toBe(createdItem.id);

    // Get by id
    const got = await agent.get(`/pain/${createdItem.id}`);
    expect(got.status).toBe(200);
    expect(got.body.data.item.id).toBe(createdItem.id);

    // Update validations
    const invalidUpdate = await agent.put(`/pain/${createdItem.id}`).send({ intensity: 0 });
    expect(invalidUpdate.status).toBe(400);
    expect(invalidUpdate.body.code).toBe('validation_failed');

    // Update success
    const updated = await agent.put(`/pain/${createdItem.id}`).send({ intensity: 8, description: 'improving' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.item.intensity).toBe(8);
    expect(updated.body.data.item.description).toBe('improving');

    // Update non-existent returns 404
    const notFoundUpdate = await agent.put('/pain/non-existent-id').send({ intensity: 5 });
    expect(notFoundUpdate.status).toBe(404);
    expect(notFoundUpdate.body.code).toBe('not_found');

    // Delete success
    const del = await agent.delete(`/pain/${createdItem.id}`);
    expect(del.status).toBe(200);
    expect(del.body.data.deleted).toBe(true);

    // Delete again -> 404
    const delAgain = await agent.delete(`/pain/${createdItem.id}`);
    expect(delAgain.status).toBe(404);
    expect(delAgain.body.code).toBe('not_found');
  });

  test('Access control: user cannot access another user\'s pain entry', async () => {
    const agent1 = request.agent(app);
    const agent2 = request.agent(app);

    const email1 = uniqueEmail();
    const email2 = uniqueEmail();

    await agent1.post('/auth/register').send({ email: email1, password: 'Secret123!' });
    await agent2.post('/auth/register').send({ email: email2, password: 'Secret123!' });

    const created = await agent1.post('/pain').send({ intensity: 6, location: 'back' });
    const id = created.body.data.item.id;

    // user2 tries to get user1's entry -> 404
    const getOther = await agent2.get(`/pain/${id}`);
    expect(getOther.status).toBe(404);
    expect(getOther.body.code).toBe('not_found');

    // user2 tries to delete user1's entry -> 404
    const delOther = await agent2.delete(`/pain/${id}`);
    expect(delOther.status).toBe(404);
    expect(delOther.body.code).toBe('not_found');
  });

  test('GET /pain with invalid bearer token returns 401', async () => {
    const res = await request(app).get('/pain').set('Authorization', 'Bearer invalid');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('invalid_token');
  });
});
