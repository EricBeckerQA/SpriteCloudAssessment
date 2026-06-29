'use strict';

const Ajv = require('ajv');
const addFormats = require('ajv-formats');

/**
 * Shared AJV instance for response-contract validation.
 *
 * Why schema validation: it asserts the *entire shape* of an API response
 * (required fields + types) in one statement, catching contract regressions a
 * handful of field-by-field `expect` calls would miss. This is the "deep
 * assertion" the brief asks for, applied to the API layer.
 */
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Validate `data` against a JSON schema.
 * @returns {{ valid: boolean, errors: string }} human-readable errors on failure.
 */
function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return {
    valid,
    errors: valid ? '' : ajv.errorsText(validate.errors, { separator: '\n' }),
  };
}

module.exports = { validateSchema };
