/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-destructuring';

const ruleTester = new RuleTester({});

ruleTester.run('no-destructuring', rule, {
	valid: [
		'const {a, b} = obj;',
		'const {a} = obj;',

		'function test({a, b}: any) {}',
		'const fn = ({a, b}: any) => {};',

		'function test({a, b} = {}) {}',

		{
			code: 'const {a, b, c} = obj;',
			options: [{ maximumDestructuredVariables: 3, maximumLineLength: 100 }],
		},

		{
			code: 'const {a, b, c, d} = obj;',
			options: [{ maximumDestructuredVariables: 4, maximumLineLength: 200 }],
		},
	],

	invalid: [
		{
			code: 'const {a, b, c} = obj;',
			errors: [
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
			],
		},

		{
			code: `
					const {a} = obj;
			`,
			errors: [
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 5 },
				},
			],
		},

		{
			code: `
				const {a, b} = someVeryLongVariableNameThatWillDefinitelyExceedTheConfiguredMaximumLineLengthLimit;
			`,
			options: [{ maximumDestructuredVariables: 2, maximumLineLength: 80 }],
			errors: [
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 4 },
				},
				{
					messageId: 'tooLong',
					data: { max: 80 },
				},
			],
		},

		{
			code: `
					const {a, b, c} = someVeryLongVariableNameThatWillDefinitelyExceedTheConfiguredMaximumLineLengthLimit;
			`,
			options: [{ maximumDestructuredVariables: 2, maximumLineLength: 80 }],
			errors: [
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 5 },
				},
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
				{
					messageId: 'tooLong',
					data: { max: 80 },
				},
			],
		},

		{
			code: 'function test({a, b, c}: any) {}',
			errors: [
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
			],
		},

		{
			code: 'const fn = ({a, b, c}: any) => {};',
			errors: [
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
			],
		},

		{
			code: 'function test({a, b, c} = {}) {}',
			errors: [
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
			],
		},

		{
			code: `
				class A {
					method({a, b, c}: any) {}
				}
			`,
			errors: [
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 5 },
				},
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 5 },
				},
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
			],
		},
	],
});
