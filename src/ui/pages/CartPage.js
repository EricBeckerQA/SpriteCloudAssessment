'use strict';

const { BasePage } = require('./BasePage');

/** Shopping cart page. Lists chosen items and routes into checkout. */
class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItem = page.locator('[data-test="inventory-item"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async getItemNames() {
    return this.itemName.allTextContents();
  }

  /** Raw price labels (e.g. "$29.99") for the items currently in the cart. */
  async getItemPriceLabels() {
    return this.itemPrice.allTextContents();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
