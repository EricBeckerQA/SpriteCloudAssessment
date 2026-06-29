'use strict';

/**
 * Response contract for a single DummyJSON product (GET /products/{id}).
 * Captures the fields and types a consumer relies on. `additionalProperties`
 * stays open so the test doesn't break when DummyJSON adds new fields.
 */
const productSchema = {
  type: 'object',
  required: ['id', 'title', 'description', 'category', 'price', 'stock', 'rating', 'thumbnail', 'images'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    category: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 },
    discountPercentage: { type: 'number' },
    rating: { type: 'number', minimum: 0, maximum: 5 },
    stock: { type: 'integer', minimum: 0 },
    tags: { type: 'array', items: { type: 'string' } },
    thumbnail: { type: 'string', format: 'uri' },
    images: { type: 'array', items: { type: 'string', format: 'uri' } },
  },
  additionalProperties: true,
};

module.exports = { productSchema };
