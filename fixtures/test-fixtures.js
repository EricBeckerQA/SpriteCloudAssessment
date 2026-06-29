'use strict';

/**
 * Custom Playwright fixtures — the framework's dependency-injection seam.
 *
 * Extending the base `test` with our flows and API clients means a spec just
 * declares what it needs in its arguments (`{ checkoutFlow }`, `{ cartClient }`)
 * and receives a ready-to-use instance. Specs never `new` a page object or
 * client, so construction lives in one place and the tests stay declarative.
 *
 * UI fixtures depend on `page`; API fixtures depend on `request`. Playwright
 * only instantiates the fixtures a given test actually asks for, so the UI and
 * API projects each pull only what they need.
 */
const base = require('@playwright/test');

const { LoginFlow } = require('../src/ui/flows/LoginFlow');
const { CheckoutFlow } = require('../src/ui/flows/CheckoutFlow');
const { AuthClient } = require('../src/api/clients/AuthClient');
const { ProductClient } = require('../src/api/clients/ProductClient');
const { CartClient } = require('../src/api/clients/CartClient');

const test = base.test.extend({
  // --- UI business-layer flows ---
  loginFlow: async ({ page }, use) => {
    await use(new LoginFlow(page));
  },
  checkoutFlow: async ({ page }, use) => {
    await use(new CheckoutFlow(page));
  },

  // --- API resource clients ---
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  productClient: async ({ request }, use) => {
    await use(new ProductClient(request));
  },
  cartClient: async ({ request }, use) => {
    await use(new CartClient(request));
  },
});

module.exports = { test, expect: base.expect };
