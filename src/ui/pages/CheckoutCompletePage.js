'use strict';

const { BasePage } = require('./BasePage');

/** Checkout step three: order confirmation page. */
class CheckoutCompletePage extends BasePage {
  constructor(page) {
    super(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async getConfirmationText() {
    return (await this.completeHeader.textContent())?.trim();
  }
}

module.exports = { CheckoutCompletePage };
