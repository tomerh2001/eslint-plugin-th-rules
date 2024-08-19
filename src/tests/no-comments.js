/* eslint-disable unicorn/prefer-module */

const { RuleTester } = require('eslint');
const rule = require('../rules/no-comments.js');

// Initialize RuleTester without the old parserOptions, using the new format
const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
});

ruleTester.run('no-disallowed-comments', rule, {
  valid: [
    {
      code: `
        /**
         * JSDoc comment
         * @param {string} name - The name of the person.
         */
        function foo(name) {}
      `,
    },
    {
      code: `
        // TODO: this needs to be refactored
        const x = 5;
      `,
    },
    {
      code: `
        /* WARNING: temporary fix */
        const y = 10;
      `,
    },
    {
      code: `
        // eslint-disable-next-line no-console
        console.log("hello");
      `,
    },
    {
      code: `
        // keep this comment
        const z = 15;
      `,
      options: [{ allow: ['keep'] }],
    },
  ],

  invalid: [
    {
      code: `
        // Regular comment
        const a = 5;
      `,
      errors: [{ message: 'Comment not allowed.' }],
      output: `
        const a = 5;
      `,
    },
    {
      code: `
        // Some disallowed comment
        const b = 10;
      `,
      options: [{ disallow: ['disallowed'] }],
      errors: [{ message: 'Comment not allowed.' }],
      output: `
        const b = 10;
      `,
    },
    {
      code: `
        // DEPRECATED: Remove this function in the next version
        function deprecatedFunc() {}
      `,
      options: [{ disallow: ['deprecated'] }],
      errors: [{ message: 'Comment not allowed.' }],
      output: `
        function deprecatedFunc() {}
      `,
    },
    {
      code: `
        // important comment
        const c = 20;
      `,
      errors: [{ message: 'Comment not allowed.' }],
      output: `
        const c = 20;
      `,
    },
    {
      code: `
        // A completely random comment
        const d = 25;
      `,
      options: [{ allow: ['keep'] }],
      errors: [{ message: 'Comment not allowed.' }],
      output: `
        const d = 25;
      `,
    },
    {
      code: `
        // @ts-ignore
        const e = "typescript";
      `,
      options: [{ disallow: ['@ts-ignore'] }],
      errors: [{ message: 'Comment not allowed.' }],
      output: `
        const e = "typescript";
      `,
    },
  ],
});