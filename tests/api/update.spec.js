'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { apiProductId } = require('../../src/config/test-data');
const { validateSchema } = require('../../src/api/schemas/validator');
const { productSchema } = require('../../src/api/schemas/product.schema');

test.describe('DummyJSON product update', () => {
  test('updates a product and echoes the new field values', async ({ productClient }) => {
    const patch = { title: 'Updated Mascara', price: 19.99 };
    const response = await productClient.update(apiProductId, patch);

    expect(response.ok(), 'product update should return a 2xx status').toBeTruthy();
    const body = await response.json();

    const { valid, errors } = validateSchema(productSchema, body);
    expect(valid, errors).toBe(true);

    expect(body.id).toBe(apiProductId);
    expect(body.title).toBe(patch.title);
    expect(body.price).toBe(patch.price);
  });
});
