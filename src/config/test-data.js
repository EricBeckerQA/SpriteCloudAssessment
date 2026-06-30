'use strict';

/** Centralised test data: users, product ids and business constants. */

const uiUsers = {
  standard: {
    username: process.env.SAUCE_STANDARD_USER || 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  // Invalid credentials used to drive the failed-login scenario.
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

const apiUser = {
  username: process.env.API_USERNAME || 'emilys',
  password: process.env.API_PASSWORD || 'emilyspass',
};

/** SauceDemo's checkout tax rate, used to derive expected totals rather than hardcoding them. */
const checkout = {
  taxRate: 0.08,
  customer: {
    firstName: 'Eric',
    lastName: 'Becker',
    postalCode: '1011AB',
  },
  itemsUnderTest: [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
  ],
};

/** Product id exercised by the API "get a product" and "delete" scenarios. */
const apiProductId = 1;

module.exports = { uiUsers, apiUser, checkout, apiProductId };
