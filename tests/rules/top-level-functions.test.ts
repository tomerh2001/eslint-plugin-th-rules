/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/top-level-functions';

const ruleTester = new RuleTester({});

ruleTester.run('top-level-functions', rule, {
	valid: [
		`
      function good() {}
    `,
		`
      const x = 1;
      function good2(a, b) { return a + b; }
    `,
		`
      export function namedExport() {}
    `,
		`
      function wrapper() {
        const inner = () => {};
      }
    `,
		`
      function wrapper() {
        const inner = function () {};
      }
    `,
		`
      export default function named() {}
    `,
	],

	invalid: [
		{
			code: `
        const run = () => 42;
      `,
			errors: [{ messageId: 'arrow' }],
			output: `
        function run() { return 42; }
      `,
		},

		{
			code: `
        export const load = async () => {};
      `,
			errors: [{ messageId: 'arrow' }],
			output: `
        export async function load() {}
      `,
		},

		{
			code: `
        const compute = function(a, b) { return a + b; };
      `,
			errors: [{ messageId: 'funcExpr' }],
			output: `
        function compute(a, b) { return a + b; }
      `,
		},

		{
			code: `
        export const handle = async function(x) { return x * 2; };
      `,
			errors: [{ messageId: 'funcExpr' }],
			output: `
        export async function handle(x) { return x * 2; }
      `,
		},

		{
			code: `
        export default function () { console.log("x"); }
      `,
			errors: [{ messageId: 'anonDecl' }],
			output: `
        export function defaultFunction() { console.log("x"); }
      `,
		},

		{
			code: `
        export default function () { return 1; }
      `,
			errors: [{ messageId: 'anonDecl' }],
			output: `
        export function defaultFunction() { return 1; }
      `,
		},
	],
});
