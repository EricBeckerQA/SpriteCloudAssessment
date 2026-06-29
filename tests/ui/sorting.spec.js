'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { SortOption } = require('../../src/ui/pages/InventoryPage');
const { uiUsers } = require('../../src/config/test-data');

/**
 * Challenge UI case 2: sort items by name Z-A and validate the sorting.
 *
 * Rather than comparing against a hardcoded expected list (brittle and
 * tautological), we read the rendered order and assert it equals the same set
 * sorted descending. `expect(actual).toEqual(sortedCopy)` proves *every*
 * adjacent pair is in order — a partial or broken sort fails.
 */
test.describe('SauceDemo product sorting', () => {
  test('orders products by name Z-A', async ({ loginFlow }) => {
    const inventoryPage = await loginFlow.loginAs(uiUsers.standard);

    await inventoryPage.sortBy(SortOption.NAME_Z_TO_A);
    const renderedNames = await inventoryPage.getProductNames();

    expect(renderedNames.length).toBeGreaterThan(1);

    const expectedOrder = [...renderedNames].sort((a, b) => b.localeCompare(a));
    expect(renderedNames).toEqual(expectedOrder);
  });
});
