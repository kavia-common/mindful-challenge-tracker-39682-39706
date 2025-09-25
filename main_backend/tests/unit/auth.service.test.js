'use strict';

const authService = require('../../src/services/auth');

describe('AuthService Unit', () => {
  function uniqueEmail() {
    return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`;
  }

  test('register - duplicate email throws with 409 email_in_use', async () => {
    const email = uniqueEmail();
    await authService.register({ email, password: '123456' });
    await expect(authService.register({ email, password: '123456' }))
      .rejects.toMatchObject({ status: 409, code: 'email_in_use' });
  });

  test('login - invalid password throws invalid_credentials', async () => {
    const email = uniqueEmail();
    await authService.register({ email, password: 'Correct123' });
    await expect(authService.login({ email, password: 'Wrong' }))
      .rejects.toMatchObject({ status: 401, code: 'invalid_credentials' });
  });

  test('verify - invalid token throws invalid_token', () => {
    expect(() => authService.verify('bad.token.value'))
      .toThrowError(expect.objectContaining({ status: 401, code: 'invalid_token' }));
  });
});
