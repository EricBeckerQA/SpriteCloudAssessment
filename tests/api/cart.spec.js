'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { apiUser } = require('../../src/config/test-data');
const { validateSchema } = require('../../src/api/schemas/validator');
const { cartSchema } = require('../../src/api/schemas/cart.schema');

/**
 * Challenge API case 3: for the same user id, create a cart with 3 products and
 * validate the response.
 *
 * "Same user id" is taken literally — we log in first, take the id the auth
 * response returns, and build the cart for that id, then assert the cart echoes
 * it back. We also reconcile the server's totals against the line items so a
 * miscalculated total/quantity is caught, not just the product count.
 */
test.describe('DummyJSON cart', () => {
  const cartProducts = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
    { id: 3, quantity: 3 },
  ];

  test('creates a cart with three products for the logged-in user', async ({
    authClient,
    cartClient,
  }) => {
    const loginResponse = await authClient.login(apiUser);
    expect(loginResponse.status()).toBe(200);
    const { id: userId } = await loginResponse.json();

    const response = await cartClient.create(userId, cartProducts);
    expect(response.ok(), 'cart creation should return a 2xx status').toBeTruthy();

    const body = await response.json();

    const { valid, errors } = validateSchema(cartSchema, body);
    expect(valid, errors).toBe(true);

    expect(body.userId).toBe(userId);
    expect(body.totalProducts).toBe(cartProducts.length);
    expect(body.products).toHaveLength(cartProducts.length);

    // Reconcile the server-side totals against the returned line items.
    const expectedTotal = body.products.reduce((sum, item) => sum + item.total, 0);
    expect(body.total).toBeCloseTo(expectedTotal, 2);

    const expectedQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    expect(body.totalQuantity).toBe(expectedQuantity);
  });
});
