'use strict';

const { BasePage } = require('./BasePage');

/** Sort dropdown option values exposed by SauceDemo. */
const SortOption = Object.freeze({
  NAME_A_TO_Z: 'az',
  NAME_Z_TO_A: 'za',
  PRICE_LOW_TO_HIGH: 'lohi',
  PRICE_HIGH_TO_LOW: 'hilo',
});

/** Product listing page: item locators, sort control, cart link. */
class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /** Add a single product to the cart by its visible name. */
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

  async openCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage, SortOption };
