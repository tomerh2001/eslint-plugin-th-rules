/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-destructuring';

const ruleTester = new RuleTester({});

ruleTester.run('no-destructuring', rule, {
	valid: [
		// Variable destructuring within default limits
		'const {a, b} = obj;',
		'const {a} = obj;',

		// Function parameters
		'function test({a, b}: any) {}',
		'const fn = ({a, b}: any) => {};',

		// Assignment pattern
		'function test({a, b} = {}) {}',

		// Custom max variables
		{
			code: 'const {a, b, c} = obj;',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 100}],
		},

		// Custom limits allow long line
		{
			code: 'const {a, b, c, d} = obj;',
			options: [{maximumDestructuredVariables: 4, maximumLineLength: 200}],
		},
	],

	invalid: [
		// Too many variables (default max = 2)
		{
			code: 'const {a, b, c} = obj;',
			errors: [
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
			],
		},

		// Too deep indentation
		{
			code: `
					const {a} = obj;
			`,
			errors: [
				{
					messageId: 'tooDeep',
					data: {max: 3, actual: 5},
				},
			],
		},

		// Too long line AND too deep
		{
			code: `
				const {a, b} = someVeryLongVariableNameThatWillDefinitelyExceedTheConfiguredMaximumLineLengthLimit;
			`,
			options: [{maximumDestructuredVariables: 2, maximumLineLength: 80}],
			errors: [
				{
					messageId: 'tooDeep',
					data: {max: 3, actual: 4},
				},
				{
					messageId: 'tooLong',
					data: {max: 80},
				},
			],
		},

		// All three violations together
		{
			code: `
					const {a, b, c} = someVeryLongVariableNameThatWillDefinitelyExceedTheConfiguredMaximumLineLengthLimit;
			`,
			options: [{maximumDestructuredVariables: 2, maximumLineLength: 80}],
			errors: [
				{
					messageId: 'tooDeep',
					data: {max: 3, actual: 5},
				},
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
				{
					messageId: 'tooLong',
					data: {max: 80},
				},
			],
		},

		// Function parameter destructuring – too many
		{
			code: 'function test({a, b, c}: any) {}',
			errors: [
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
			],
		},

		// Arrow function parameter – too many
		{
			code: 'const fn = ({a, b, c}: any) => {};',
			errors: [
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
			],
		},

		// Assignment pattern parameter – too many
		{
			code: 'function test({a, b, c} = {}) {}',
			errors: [
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
			],
		},

		// Method definition parameters (duplicate visitor execution)
		{
			code: `
				class A {
					method({a, b, c}: any) {}
				}
			`,
			errors: [
				{
					messageId: 'tooDeep',
					data: {max: 3, actual: 5},
				},
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
				{
					messageId: 'tooDeep',
					data: {max: 3, actual: 5},
				},
				{
					messageId: 'tooMany',
					data: {max: 2},
				},
			],
		},
	],
});
