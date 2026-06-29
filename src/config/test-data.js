'use strict';

/**
 * Centralised test data. Keeping users, product ids and business constants here
 * (rather than as magic strings inside specs) means a value changes in exactly
 * one place and intent is self-documenting at the call site.
 */

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

/**
 * SauceDemo applies an 8% sales tax at checkout. We keep the rate here so the
 * price assertion can *derive* the expected tax/total instead of hardcoding a
 * dollar figure — if the rate ever changes, the test still validates the math.
 */
const checkout = {
  taxRate: 0.08,
  customer: {
    firstName: 'Eric',
    lastName: 'Becker',
    postalCode: '1011AB',
  },
  // Items added to the cart for the checkout journey (at least two, per the brief).
  itemsUnderTest: [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ],
};

/** Product id exercised by the API "get a product" and "delete" scenarios. */
const apiProductId = 1;

module.exports = { uiUsers, apiUser, checkout, apiProductId };
