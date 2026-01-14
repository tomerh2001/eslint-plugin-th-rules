const {RuleTester} = require('@typescript-eslint/rule-tester');
const rule = require('../src/rules/prefer-explicit-nil-or-empty-check');

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
});

ruleTester.run('prefer-explicit-nil-or-empty-check', rule, {
	valid: [
		// Explicit checks – allowed
		'if (_.isNil(value)) {}',
		'if (!_.isNil(value)) {}',
		'if (_.isEmpty(list)) {}',
		'if (!_.isEmpty(list)) {}',

		// Explicit comparisons – allowed
		'if (value != null) {}',
		'if (list.length > 0) {}',

		// Boolean values – allowed
		'if (true) {}',
		'if (false) {}',

		// Non-control-flow usage – allowed
		'value;',
		'doSomething(value);',
	],

	invalid: [
		{
			code: 'if (dataObject) {}',
			errors: [
				{
					message:
						'Implicit truthy/falsy check on a non-boolean value is not allowed; use explicit _.isNil or _.isEmpty checks',
					suggestions: [
						{
							desc: 'Replace with !_.isNil(dataObject)',
							output: 'if (!_.isNil(dataObject)) {}',
						},
						{
							desc: 'Replace with !_.isEmpty(dataObject)',
							output: 'if (!_.isEmpty(dataObject)) {}',
						},
					],
				},
			],
		},

		{
			code: 'if (!dataObject) {}',
			errors: [
				{
					message:
						'Implicit truthy/falsy check on a non-boolean value is not allowed; use explicit _.isNil or _.isEmpty checks',
					suggestions: [
						{
							desc: 'Replace with _.isNil(dataObject)',
							output: 'if (_.isNil(dataObject)) {}',
						},
						{
							desc: 'Replace with _.isEmpty(dataObject)',
							output: 'if (_.isEmpty(dataObject)) {}',
						},
					],
				},
			],
		},

		{
			code: 'while (items) {}',
			errors: [
				{
					message:
						'Implicit truthy/falsy check on a non-boolean value is not allowed; use explicit _.isNil or _.isEmpty checks',
					suggestions: [
						{
							desc: 'Replace with !_.isNil(items)',
							output: 'while (!_.isNil(items)) {}',
						},
						{
							desc: 'Replace with !_.isEmpty(items)',
							output: 'while (!_.isEmpty(items)) {}',
						},
					],
				},
			],
		},

		{
			code: 'data && doSomething();',
			errors: [
				{
					message:
						'Implicit truthy/falsy check on a non-boolean value is not allowed; use explicit _.isNil or _.isEmpty checks',
					suggestions: [
						{
							desc: 'Replace with !_.isNil(data)',
							output: '!_.isNil(data) && doSomething();',
						},
						{
							desc: 'Replace with !_.isEmpty(data)',
							output: '!_.isEmpty(data) && doSomething();',
						},
					],
				},
			],
		},
	],
});
