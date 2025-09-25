'use strict';

const request = require('supertest');
const app = require('../../src/app');
const config = require('../../src/config/env');

describe('Profile Integration', () => {
  function uniqueEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
  }

  test('GET /profile - unauthorized returns 401', async () => {
    const res = await request(app).get('/profile');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('auth_required');
  });

  test('GET /profile - authorized returns profile', async () => {
    const agent = request.agent(app);
    const email = uniqueEmail();
    await agent.post('/auth/register').send({ email, password: 'Secret123!' });

    const res = await agent.get('/profile');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.profile.email).toBe(email.toLowerCase());
    // Ensure no passwordHash field
    expect(res.body.data.profile.passwordHash).toBeUndefined();
  });

  test('PUT /profile - updates profile fields', async () => {
    const agent = request.agent(app);
    const email = uniqueEmail();
    await agent.post('/auth/register').send({ email, password: 'Secret123!' });

    const res = await agent.put('/profile').send({ name: 'New Name', bio: 'Updated bio' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.profile.name).toBe('New Name');
    expect(res.body.data.profile.bio).toBe('Updated bio');
  });

  test('GET /profile - invalid token returns 401', async () => {
    const res = await request(app).get('/profile').set('Authorization', 'Bearer invalid_token');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('invalid_token');
  });
});
