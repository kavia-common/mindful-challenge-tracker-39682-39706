'use strict';

const request = require('supertest');
const app = require('../../src/app');
const config = require('../../src/config/env');

describe('Auth Integration', () => {
  function uniqueEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
  }

  test('POST /auth/register - success sets cookie and returns user', async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/auth/register')
      .send({ email, password: 'Secret123!', name: 'Alice', bio: 'bio' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('created');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(email.toLowerCase());
    // Cookie should be set
    const setCookie = res.headers['set-cookie'] || [];
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : String(setCookie || '');
    expect(cookieStr).toContain(`${config.cookieName}=`);
  });

  test('POST /auth/register - duplicate email returns 409', async () => {
    const email = uniqueEmail();
    await request(app).post('/auth/register').send({ email, password: '123456' });
    const res = await request(app).post('/auth/register').send({ email, password: '123456' });

    expect(res.status).toBe(409);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('email_in_use');
  });

  test('POST /auth/register - missing fields returns 400', async () => {
    const res = await request(app).post('/auth/register').send({ email: uniqueEmail() });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('validation_failed');
  });

  test('POST /auth/login - success sets cookie and returns user', async () => {
    const email = uniqueEmail();
    await request(app).post('/auth/register').send({ email, password: 'Secret123!' });

    const res = await request(app).post('/auth/login').send({ email, password: 'Secret123!' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data.user.email).toBe(email.toLowerCase());
    const setCookie = res.headers['set-cookie'] || [];
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(';') : String(setCookie || '');
    expect(cookieStr).toContain(`${config.cookieName}=`);
  });

  test('POST /auth/login - invalid credentials returns 401', async () => {
    const email = uniqueEmail();
    await request(app).post('/auth/register').send({ email, password: 'Secret123!' });

    const res = await request(app).post('/auth/login').send({ email, password: 'Wrong!' });
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('invalid_credentials');
  });

  test('POST /auth/login - missing fields returns 400', async () => {
    const res = await request(app).post('/auth/login').send({ email: uniqueEmail() });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('validation_failed');
  });

  test('POST /auth/logout - clears session and returns ok', async () => {
    const email = uniqueEmail();
    const agent = request.agent(app);
    await agent.post('/auth/register').send({ email, password: 'Secret123!' });

    const res = await agent.post('/auth/logout').send();
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    // Typically will include Set-Cookie clearing the cookie
    const setCookie = res.headers['set-cookie'] || [];
    expect(setCookie.length).toBeGreaterThan(0);
  });
});
