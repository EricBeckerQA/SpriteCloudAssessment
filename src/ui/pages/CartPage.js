'use strict';

const { BasePage } = require('./BasePage');

/** Shopping cart page. Routes into checkout. */
class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
