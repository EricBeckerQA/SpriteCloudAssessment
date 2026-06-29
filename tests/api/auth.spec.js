'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { apiUser } = require('../../src/config/test-data');

/**
 * Challenge API case 1: perform a successful login.
 *
 * Beyond a 200, we assert a real auth token came back and that the response
 * actually describes the user we asked for — a login that returns 200 for the
 * wrong account would still fail here.
 */
test.describe('DummyJSON auth', () => {
  test('logs in and returns a token for the requested user', async ({ authClient }) => {
    const response = await authClient.login(apiUser);

    expect(response.status()).toBe(200);
    const body = await response.json();

    // DummyJSON has used both `token` and `accessToken` across versions.
    const authToken = body.accessToken ?? body.token;
    expect(authToken, 'a non-empty auth token should be returned').toBeTruthy();
    expect(typeof authToken).toBe('string');

    expect(body.username).toBe(apiUser.username);
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('id');
  });
});
