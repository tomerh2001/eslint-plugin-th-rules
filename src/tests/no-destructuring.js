const {RuleTester} = require('eslint');
const rule = require('../../../lib/rules/no-destructuring.js');

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 2020, // ES6 syntax
		sourceType: 'module', // Allows the use of imports
	},
});

ruleTester.run('no-destructuring', rule, {
	valid: [
		{
			code: 'const { a, b } = obj;',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 80}],
		},
		{
			code: 'const { a } = obj;',
			options: [{maximumDestructuredVariables: 2, maximumLineLength: 80}],
		},
		{
			code: 'const { a, b, c } = obj;',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 30}],
		},
		{
			code: 'function foo() {\n\tconst { a, b } = obj;\n}',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 80}],
		},
		{
			code: '\tconst { a, b } = obj;',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 80}],
		},
	],
	invalid: [
		{
			code: 'const { a, b, c } = obj;',
			options: [{maximumDestructuredVariables: 2, maximumLineLength: 80}],
			errors: [{message: 'destructuring of more than 2 variables is not allowed'}],
		},
		{
			code: 'const { a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z } = obj;',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 80}],
			errors: [{message: 'destructuring of more than 3 variables is not allowed'}, {message: 'destructuring on a line exceeding 80 characters is not allowed'}],
		},
		{
			code: 'function foo() {\n\t\t\t\t\t\t\tconst { a, b } = obj;\n}',
			options: [{maximumDestructuredVariables: 3, maximumLineLength: 80}],
			errors: [{message: 'destructuring at a nesting level above 3 is not allowed, instead saw 7 levels of nesting'}],
		},
	],
});
