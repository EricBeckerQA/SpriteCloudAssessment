'use strict';

/**
 * Single source of truth for environment configuration.
 *
 * Every value is resolved from an environment variable first and falls back to a
 * public default, so the suite is "environment-ready" (point it at staging by
 * exporting different vars) while still running out-of-the-box in CI.
 *
 * No base URL, credential, or endpoint host is hardcoded anywhere else in the
 * framework — callers import from here.
 */

require('dotenv').config();

const environment = {
  ui: {
    baseUrl: process.env.BASE_URL_UI || 'https://www.saucedemo.com',
  },
  api: {
    baseUrl: process.env.BASE_URL_API || 'https://dummyjson.com',
  },
};

module.exports = { environment };
