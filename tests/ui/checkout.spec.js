'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { uiUsers, checkout } = require('../../src/config/test-data');
const {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} = require('../../src/utils/priceCalculator');

/**
 * Challenge UI case 1: full checkout of at least two items, validate final price.
 *
 * The price assertion is *derived*, not hardcoded: we read the per-item prices
 * the summary shows, compute the expected subtotal/tax/total from them, and
 * assert the app's displayed breakdown matches. This catches a wrong tax rate
 * or a bad sum — failures a hardcoded "$43.18" check would either miss or make
 * brittle the moment SauceDemo changes its catalogue.
 */
test.describe('SauceDemo checkout', () => {
  test('completes a multi-item checkout and validates the price breakdown', async ({
    loginFlow,
    checkoutFlow,
  }) => {
    const inventoryPage = await loginFlow.loginAs(uiUsers.standard);
    await expect(inventoryPage.sortDropdown).toBeVisible();

    const overviewPage = await checkoutFlow.addItemsAndReachOverview(
      checkout.itemsUnderTest,
      checkout.customer,
    );

    const itemPrices = await overviewPage.getItemPrices();
    expect(itemPrices).toHaveLength(checkout.itemsUnderTest.length);

    const expectedSubtotal = calculateSubtotal(itemPrices);
    const expectedTax = calculateTax(expectedSubtotal, checkout.taxRate);
    const expectedTotal = calculateTotal(expectedSubtotal, expectedTax);

    expect(await overviewPage.getDisplayedSubtotal()).toBe(expectedSubtotal);
    expect(await overviewPage.getDisplayedTax()).toBe(expectedTax);
    expect(await overviewPage.getDisplayedTotal()).toBe(expectedTotal);

    const completePage = await checkoutFlow.completeOrder();
    expect(await completePage.getConfirmationText()).toBe('Thank you for your order!');
  });
});
