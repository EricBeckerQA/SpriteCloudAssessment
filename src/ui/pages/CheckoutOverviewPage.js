'use strict';

const { BasePage } = require('./BasePage');
const { parsePrice } = require('../../utils/priceCalculator');

/**
 * Checkout step two: order summary with per-item prices and the
 * item-total / tax / total breakdown the price assertion validates.
 */
class CheckoutOverviewPage extends BasePage {
  constructor(page) {
    super(page);
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  /** Numeric per-item prices listed on the summary. */
  async getItemPrices() {
    const labels = await this.itemPrice.allTextContents();
    return labels.map(parsePrice);
  }

  /** "Item total: $39.98" -> 39.98 */
  async getDisplayedSubtotal() {
    return parsePrice(await this.subtotalLabel.textContent());
  }

  /** "Tax: $3.20" -> 3.20 */
  async getDisplayedTax() {
    return parsePrice(await this.taxLabel.textContent());
  }

  /** "Total: $43.18" -> 43.18 */
  async getDisplayedTotal() {
    return parsePrice(await this.totalLabel.textContent());
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutOverviewPage };
