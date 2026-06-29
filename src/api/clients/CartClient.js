'use strict';

const { BaseApiClient } = require('./BaseApiClient');

/** DummyJSON cart endpoints. */
class CartClient extends BaseApiClient {
  /**
   * POST /carts/add
   * @param {number} userId
   * @param {Array<{id:number, quantity:number}>} products
   */
  async create(userId, products) {
    return this.request.post('/carts/add', {
      data: { userId, products },
    });
  }
}

module.exports = { CartClient };
