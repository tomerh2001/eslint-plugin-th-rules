const {RuleTester} = require('@typescript-eslint/rule-tester');
const rule = require('../src/rules/no-boolean-coercion');

const ruleTester = new RuleTester({});

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
					messageId: 'useIsNil',
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
					messageId: 'useIsNil',
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
					messageId: 'useIsNil',
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
					messageId: 'useIsEmpty',
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
