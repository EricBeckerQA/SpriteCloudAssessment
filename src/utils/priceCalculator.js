'use strict';

/**
 * Pure money helpers for the checkout price assertion.
 *
 * Kept framework-agnostic (no Playwright import) so the math can be reasoned
 * about and unit-tested in isolation. The checkout spec derives the expected
 * tax and total from these functions rather than hardcoding dollar amounts.
 */

/** Round to 2 decimals, avoiding binary floating-point drift (e.g. 1.005). */
function roundCurrency(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/** Parse a SauceDemo price label like "$29.99" into the number 29.99. */
function parsePrice(priceLabel) {
  const numeric = Number(String(priceLabel).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) {
    throw new Error(`Unable to parse a price from "${priceLabel}"`);
  }
  return numeric;
}

/** Sum a list of numeric item prices into a subtotal. */
function calculateSubtotal(itemPrices) {
  return roundCurrency(itemPrices.reduce((sum, price) => sum + price, 0));
}

/** Tax = subtotal * rate, rounded to cents. */
function calculateTax(subtotal, taxRate) {
  return roundCurrency(subtotal * taxRate);
}

/** Final total = subtotal + tax. */
function calculateTotal(subtotal, tax) {
  return roundCurrency(subtotal + tax);
}

module.exports = {
  roundCurrency,
  parsePrice,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
};
