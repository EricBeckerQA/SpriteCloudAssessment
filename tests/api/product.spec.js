'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { apiProductId } = require('../../src/config/test-data');
const { validateSchema } = require('../../src/api/schemas/validator');
const { productSchema } = require('../../src/api/schemas/product.schema');

/**
 * Challenge API case 2: get a product and validate its content.
 *
 * The schema check validates the whole response contract (required fields +
 * types) in one assertion; the follow-up checks pin the specific business facts
 * we requested (correct id, a sane price).
 */
test.describe('DummyJSON product', () => {
  test('returns a product that satisfies the product contract', async ({ productClient }) => {
    const response = await productClient.getById(apiProductId);

    expect(response.status()).toBe(200);
    const body = await response.json();

    const { valid, errors } = validateSchema(productSchema, body);
    expect(valid, errors).toBe(true);

    expect(body.id).toBe(apiProductId);
    expect(body.price).toBeGreaterThan(0);
    expect(body.title.length).toBeGreaterThan(0);
  });
});
