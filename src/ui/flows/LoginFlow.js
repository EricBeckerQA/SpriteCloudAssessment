'use strict';

const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

/**
 * Business layer for authentication. Composes the login page object into a
 * reusable journey so specs say "log in as the standard user" in one line
 * instead of repeating field-level steps. Flows orchestrate; they don't assert.
 */
class LoginFlow {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  /** Log in and land on the inventory page. Returns it for chaining. */
  async loginAs({ username, password }) {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
    return this.inventoryPage;
  }
}

module.exports = { LoginFlow };
