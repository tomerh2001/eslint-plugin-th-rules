const {RuleTester} = require('eslint');
const rule = require('../src/rules/no-boolean-coercion');

const ruleTester = new RuleTester({});

const ERROR_MESSAGE
	= 'Boolean coercion is not allowed. Use an explicit null/empty check instead.';

ruleTester.run('no-boolean-coercion', rule, {
	valid: [
		'_.isNil(value);',
		'_.isEmpty(list);',
		'if (value != null) {}',
		'if (list.length > 0) {}',
		'Boolean;',
		'const BooleanValue = true;',
		'const fn = Boolean;',
	],

	invalid: [
		{
			code: 'Boolean(foo);',
			errors: [
				{
					message: ERROR_MESSAGE,
					suggestions: [
						{
							desc: 'Replace with _.isNil(foo)',
							output: '_.isNil(foo);',
						},
					],
				},
			],
		},

		{
			code: 'const x = Boolean(bar);',
			errors: [
				{
					message: ERROR_MESSAGE,
					suggestions: [
						{
							desc: 'Replace with _.isNil(bar)',
							output: 'const x = _.isNil(bar);',
						},
					],
				},
			],
		},

		{
			code: '!!value;',
			errors: [
				{
					message: ERROR_MESSAGE,
					suggestions: [
						{
							desc: 'Replace with _.isNil(value)',
							output: '_.isNil(value);',
						},
					],
				},
			],
		},

		{
			code: 'Boolean([]);',
			errors: [
				{
					message: ERROR_MESSAGE,
					suggestions: [
						{
							desc: 'Replace with _.isEmpty([])',
							output: '_.isEmpty([]);',
						},
					],
				},
			],
		},

	],
});
