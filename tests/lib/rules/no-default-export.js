const {RuleTester} = require('eslint');
const rule = require('../../../lib/rules/no-default-export.js');

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
});

ruleTester.run('no-unamed-default-export', rule, {
	valid: [
		// Already named exports should pass
		'const a = 1; export default a;',
		'export default function foo() {}',
		'export default class Foo {}',
	],
	invalid: [
		// Function exports without a name
		{
			code: 'export default function () {}',
			output: 'const Input = function () {};\nexport default Input;',
			errors: [{message: 'Unnamed default export should be named based on the file name.'}],
		},
		// Class exports without a name
		{
			code: 'export default class {}',
			output: 'const Input = class {};\nexport default Input;',
			errors: [{message: 'Unnamed default export should be named based on the file name.'}],
		},
		// Object literal exports
		{
			code: 'export default {}',
			output: 'const Input = {};\nexport default Input;',
			errors: [{message: 'Unnamed default export should be named based on the file name.'}],
		},
		// Primitive value exports
		{
			code: 'export default 42',
			output: 'const Input = 42;\nexport default Input;',
			errors: [{message: 'Unnamed default export should be named based on the file name.'}],
		},
		// Null exports
		{
			code: 'export default null',
			output: 'const Input = null;\nexport default Input;',
			errors: [{message: 'Unnamed default export should be named based on the file name.'}],
		},
		// Arrow function exports
		{
			code: 'export default () => {}',
			output: 'const Input = () => {};\nexport default Input;',
			errors: [{message: 'Unnamed default export should be named based on the file name.'}],
		},
	],
});
