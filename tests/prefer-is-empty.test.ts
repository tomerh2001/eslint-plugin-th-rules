const {RuleTester} = require('@typescript-eslint/rule-tester');
const rule = require('../src/rules/prefer-is-empty');

const ruleTester = new RuleTester({});

ruleTester.run('prefer-is-empty', rule, {
	valid: [
		'_.isEmpty(values);',
		'!_.isEmpty(values);',
		'Array.isArray(values);',
		'values.size > 0;', // Non-length property
	],

	invalid: [
		{
			code: 'values.length === 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length === 0',
					suggestions: [
						{
							desc: 'Replace with _.isEmpty(values)',
							output: '_.isEmpty(values);',
						},
					],
				},
			],
		},

		{
			code: 'values.length < 1;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length < 1',
					suggestions: [
						{
							desc: 'Replace with _.isEmpty(values)',
							output: '_.isEmpty(values);',
						},
					],
				},
			],
		},

		{
			code: 'values.length <= 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length <= 0',
					suggestions: [
						{
							desc: 'Replace with _.isEmpty(values)',
							output: '_.isEmpty(values);',
						},
					],
				},
			],
		},

		{
			code: 'values.length > 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length > 0',
					suggestions: [
						{
							desc: 'Replace with !_.isEmpty(values)',
							output: '!_.isEmpty(values);',
						},
					],
				},
			],
		},

		{
			code: 'values.length >= 1;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length >= 1',
					suggestions: [
						{
							desc: 'Replace with !_.isEmpty(values)',
							output: '!_.isEmpty(values);',
						},
					],
				},
			],
		},

		{
			code: 'values.length !== 0;',
			errors: [
				{
					message:
						'Use _.isEmpty(values) instead of checking values.length !== 0',
					suggestions: [
						{
							desc: 'Replace with !_.isEmpty(values)',
							output: '!_.isEmpty(values);',
						},
					],
				},
			],
		},

		{
			code: 'if (items.length > 0) {}',
			errors: [
				{
					message:
						'Use _.isEmpty(items) instead of checking items.length > 0',
					suggestions: [
						{
							desc: 'Replace with !_.isEmpty(items)',
							output: 'if (!_.isEmpty(items)) {}',
						},
					],
				},
			],
		},

		{
			code: '0 === items.length;',
			errors: [
				{
					message:
						'Use _.isEmpty(items) instead of checking items.length === 0',
					suggestions: [
						{
							desc: 'Replace with _.isEmpty(items)',
							output: '_.isEmpty(items);',
						},
					],
				},
			],
		},
	],
});
