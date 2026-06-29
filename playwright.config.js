'use strict';

const { defineConfig, devices } = require('@playwright/test');
const { environment } = require('./src/config/env.config');

/**
 * Two projects share one runner and one report:
 *   - "ui"  drives a real browser against SauceDemo
 *   - "api" uses Playwright's APIRequestContext against DummyJSON (no browser)
 *
 * Debuggability is built in: traces, screenshots and video are retained on
 * failure so any engineer can open the HTML report and replay what happened.
 */
module.exports = defineConfig({
  testDir: './tests',
  // Fail the build if a test.only is accidentally committed.
  forbidOnly: !!process.env.CI,
  // Retry once in CI to absorb transient network flakiness against public demo apps.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: environment.ui.baseUrl,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: environment.api.baseUrl,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
  ],
});
