'use strict';

const { BaseApiClient } = require('./BaseApiClient');

/** DummyJSON product endpoints. */
class ProductClient extends BaseApiClient {
  /** GET /products/{id} */
  async getById(productId) {
    return this.request.get(`/products/${productId}`);
  }

  /** DELETE /products/{id} — DummyJSON returns the product with isDeleted/deletedOn. */
  async delete(productId) {
    return this.request.delete(`/products/${productId}`);
  }
}

module.exports = { ProductClient };
