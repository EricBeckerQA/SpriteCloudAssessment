'use strict';

const { BasePage } = require('./BasePage');

/**
 * SauceDemo login screen. Locators use stable `data-test` attributes the app
 * exposes specifically for automation, which are far less brittle than CSS/text.
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open() {
    await this.goto('/');
  }

  /** Fill credentials and submit. Atomic action — no assertions here. */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Exposed so the negative-login spec can assert on the rejection message. */
  async getErrorText() {
    return (await this.errorMessage.textContent())?.trim();
  }
}

module.exports = { LoginPage };
