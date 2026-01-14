const {RuleTester} = require('eslint');
const rule = require('../src/rules/prefer-is-empty');

const ruleTester = new RuleTester({});

ruleTester.run('prefer-is-empty', rule, {
	valid: [
		'_.isEmpty(values);',
		'!_.isEmpty(values);',
		'values.length === 0;',
		'values.length <= 0;',
		'values.length < 1;',
		'Array.isArray(values);',
		'values.size > 0;', // Non-length property
	],

	invalid: [
		{
			code: 'values.length > 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length > 0',
				},
			],
		},

		{
			code: 'values.length >= 1;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length >= 1',
				},
			],
		},

		{
			code: 'values.length != 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length != 0',
				},
			],
		},

		{
			code: 'values.length !== 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length !== 0',
				},
			],
		},

		{
			code: 'if (items.length > 0) {}',
			errors: [
				{
					message:
						'Use _.isEmpty(items) instead of checking items.length > 0',
				},
			],
		},
	],
});
