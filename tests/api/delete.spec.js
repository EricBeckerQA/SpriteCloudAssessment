'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { apiProductId } = require('../../src/config/test-data');

/**
 * Challenge API case 4: perform a DELETE operation.
 *
 * DummyJSON simulates deletion and echoes the deleted resource back with an
 * `isDeleted` flag and a `deletedOn` timestamp. We assert the right product was
 * targeted, the flag is set, and the timestamp is a parseable date.
 */
test.describe('DummyJSON product deletion', () => {
  test('deletes a product and flags it in the response', async ({ productClient }) => {
    const response = await productClient.delete(apiProductId);

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.id).toBe(apiProductId);
    expect(body.isDeleted).toBe(true);
    expect(body).toHaveProperty('deletedOn');
    expect(Number.isNaN(Date.parse(body.deletedOn))).toBe(false);
  });
});
