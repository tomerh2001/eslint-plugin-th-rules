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

		{
			code: 'const {a, b} = obj1;\nconst {c, d} = obj2;',
		},

		{
			code: 'function a() { const {x, y} = obj; }\nfunction b() { const {z, w} = obj; }',
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
			code: 'function test() {\nconst { length, onComplete } = obj;\nconst { onChangeText, value } = obj;\n}',
			errors: [
				{
					messageId: 'tooManyCumulative',
					data: { source: 'obj', max: 2, total: 4 },
				},
			],
		},

		{
			code: '\n     const {a} = obj;\n',
			errors: [
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 5 },
				},
			],
		},

		{
			code: '\n    const {a, b} = someVeryLongVariableNameThatWillDefinitelyExceedTheConfiguredMaximumLineLengthLimit;\n',
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
			code: '\n     const {a, b, c} = someVeryLongVariableNameThatWillDefinitelyExceedTheConfiguredMaximumLineLengthLimit;\n',
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
			code: 'class A {\n    method({a, b, c}: any) {}\n}\n',
			errors: [
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 4 },
				},
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
				{
					messageId: 'tooDeep',
					data: { max: 3, actual: 4 },
				},
				{
					messageId: 'tooMany',
					data: { max: 2 },
				},
			],
		},
	],
});
