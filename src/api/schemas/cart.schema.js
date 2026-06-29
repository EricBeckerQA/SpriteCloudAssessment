'use strict';

/**
 * Response contract for a created cart (POST /carts/add).
 * Validates both the cart envelope and the shape of each line item, so the
 * totals reconciliation in the spec runs against data we know is well-formed.
 */
const cartSchema = {
  type: 'object',
  required: [
    'id',
    'products',
    'total',
    'discountedTotal',
    'userId',
    'totalProducts',
    'totalQuantity',
  ],
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    total: { type: 'number', minimum: 0 },
    discountedTotal: { type: 'number', minimum: 0 },
    totalProducts: { type: 'integer', minimum: 0 },
    totalQuantity: { type: 'integer', minimum: 0 },
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title', 'price', 'quantity', 'total', 'discountedTotal'],
        properties: {
          id: { type: 'integer' },
          title: { type: 'string', minLength: 1 },
          price: { type: 'number', minimum: 0 },
          quantity: { type: 'integer', minimum: 1 },
          total: { type: 'number', minimum: 0 },
          discountPercentage: { type: 'number' },
          discountedTotal: { type: 'number', minimum: 0 },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
};

module.exports = { cartSchema };
