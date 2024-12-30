const {RuleTester} = require('eslint');
const rule = require('../src/rules/top-level-functions');

const ruleTester = new RuleTester({
	parserOptions: {ecmaVersion: 2021, sourceType: 'module'},
});

ruleTester.run('top-level-functions', rule, {
	valid: [
		'function test() {}',
		'function anotherFunction() {}',
	],
	invalid: [
		{
			code: 'const test = () => {};',
			errors: [{message: 'Top-level functions must be named/regular functions.'}],
			output: 'function test() {}',
		},
		{
			code: 'const response = (res, parameters = {}) => {};',
			errors: [{message: 'Top-level functions must be named/regular functions.'}],
			output: 'function response(res, parameters = {}) {}',
		},
		{
			code: 'const func = function () {};',
			errors: [{message: 'Top-level functions must be named/regular functions.'}],
			output: 'function func() {}',
		},
	],
});
