'use strict';

const { BaseApiClient } = require('./BaseApiClient');

/** DummyJSON authentication endpoints. */
class AuthClient extends BaseApiClient {
  /**
   * POST /auth/login
   * @returns the raw APIResponse so the spec asserts on status + body.
   */
  async login({ username, password }) {
    return this.request.post('/auth/login', {
      data: { username, password },
    });
  }
}

module.exports = { AuthClient };
