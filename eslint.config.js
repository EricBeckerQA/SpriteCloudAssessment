'use strict';

/**
 * Minimal flat ESLint config. Keeps the repo consistent without imposing heavy
 * style opinions — enough to catch unused vars and accidental globals.
 */
module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        require: 'readonly',
        module: 'writable',
        console: 'readonly',
        Date: 'readonly',
        Number: 'readonly',
        Math: 'readonly',
        String: 'readonly',
        Object: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'prefer-const': 'warn',
    },
  },
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/'],
  },
];
