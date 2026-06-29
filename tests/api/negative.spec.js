'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');

/**
 * Challenge API case 5: two negative scenarios across two different endpoints.
 *
 *   1. POST /auth/login  with bad credentials  -> 400 + "Invalid credentials"
 *   2. GET  /products/{id} with an unknown id  -> 404 + "not found"
 *
 * We validate both the status code and the error body, since a robust API
 * contract covers its failure modes as deliberately as its happy paths.
 */
const NON_EXISTENT_PRODUCT_ID = 999999;

test.describe('DummyJSON negative scenarios', () => {
  test('rejects login with invalid credentials (auth endpoint)', async ({ authClient }) => {
    const response = await authClient.login({
      username: 'definitely_not_a_real_user',
      password: 'definitely_wrong_password',
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toMatch(/invalid credentials/i);
  });

  test('returns 404 for a non-existent product (products endpoint)', async ({ productClient }) => {
    const response = await productClient.getById(NON_EXISTENT_PRODUCT_ID);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toMatch(/not found/i);
  });
});
