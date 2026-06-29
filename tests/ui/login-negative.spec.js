'use strict';

const { test, expect } = require('../../fixtures/test-fixtures');
const { LoginPage } = require('../../src/ui/pages/LoginPage');
const { uiUsers } = require('../../src/config/test-data');

/**
 * Challenge UI case 3: validate a failed login.
 *
 * A real rejection means three things, so we assert all three: the error banner
 * is shown, it carries the expected message, and the app did NOT navigate to the
 * inventory page (the user is still on login). Checking "stayed on login" guards
 * against a false pass where an error flashes but the user is let through anyway.
 */
test.describe('SauceDemo failed login', () => {
  test('rejects invalid credentials and keeps the user on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.login(uiUsers.invalid.username, uiUsers.invalid.password);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorText()).toContain(
      'Username and password do not match any user in this service',
    );
    expect(page.url()).not.toContain('inventory');
  });
});
