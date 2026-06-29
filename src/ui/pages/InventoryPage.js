'use strict';

const { BasePage } = require('./BasePage');

/** Sort dropdown option values exposed by SauceDemo. */
const SortOption = Object.freeze({
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo',
});

/**
 * Product listing page. Owns the locators for items, the sort control and the
 * cart link, plus atomic actions (add item, sort, read names). The spec decides
 * what to assert.
 */
class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Add a single product to the cart by its visible name. Scoping the button to
   * the matching item card keeps this resilient to ordering/sort changes.
   */
  async addItemToCart(itemName) {
    const card = this.inventoryItem.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }),
    });
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  async addItemsToCart(itemNames) {
    for (const itemName of itemNames) {
      await this.addItemToCart(itemName);
    }
  }

  /** Select a sort order using the typed SortOption enum (no magic strings). */
  async sortBy(sortOption) {
    await this.sortDropdown.selectOption(sortOption);
  }

  /** Ordered list of product names exactly as currently rendered. */
  async getProductNames() {
    return this.itemName.allTextContents();
  }

  async getCartItemCount() {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage, SortOption };
