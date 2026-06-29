'use strict';

/**
 * Common ground for every page object: holds the Playwright `page` handle and
 * exposes a couple of thin navigation helpers. Page objects extend this and add
 * locators + atomic actions only — never assertions or business logic.
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** Navigate to a path relative to the project's configured baseURL. */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** Current URL — used by callers that assert on navigation state. */
  url() {
    return this.page.url();
  }
}

module.exports = { BasePage };
