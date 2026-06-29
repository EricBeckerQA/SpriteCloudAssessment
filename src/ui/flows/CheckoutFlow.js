'use strict';

const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutInfoPage } = require('../pages/CheckoutInfoPage');
const { CheckoutOverviewPage } = require('../pages/CheckoutOverviewPage');
const { CheckoutCompletePage } = require('../pages/CheckoutCompletePage');

/**
 * Business layer for the end-to-end checkout journey. It walks the user from the
 * inventory page through to the order-summary page and hands back the page
 * objects the spec needs to assert on (overview + complete). It deliberately
 * stops before the final "finish" click so the spec can assert the price
 * breakdown first, then complete the order — keeping assertions in the spec.
 */
class CheckoutFlow {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutInfoPage = new CheckoutInfoPage(page);
    this.overviewPage = new CheckoutOverviewPage(page);
    this.completePage = new CheckoutCompletePage(page);
  }

  /**
   * Add the given items and advance to the order-summary (overview) page.
   * @returns {Promise<CheckoutOverviewPage>}
   */
  async addItemsAndReachOverview(itemNames, customer) {
    await this.inventoryPage.addItemsToCart(itemNames);
    await this.inventoryPage.openCart();
    await this.cartPage.proceedToCheckout();
    await this.checkoutInfoPage.fillCustomerInfo(customer);
    await this.checkoutInfoPage.continue();
    return this.overviewPage;
  }

  /** Place the order and return the confirmation page. */
  async completeOrder() {
    await this.overviewPage.finish();
    return this.completePage;
  }
}

module.exports = { CheckoutFlow };
