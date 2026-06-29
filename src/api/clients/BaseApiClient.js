'use strict';

/**
 * Thin wrapper over Playwright's APIRequestContext shared by every resource
 * client. Centralises endpoint paths to one place per client and returns the
 * raw APIResponse so specs keep full control over assertions (status + body).
 *
 * Using Playwright's own request context (rather than axios/got) means UI and
 * API tests share one HTTP stack, one config and one trace viewer.
 */
class BaseApiClient {
  /** @param {import('@playwright/test').APIRequestContext} request */
  constructor(request) {
    this.request = request;
  }
}

module.exports = { BaseApiClient };
