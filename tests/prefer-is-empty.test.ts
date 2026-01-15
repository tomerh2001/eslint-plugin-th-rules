import {RuleTester} from '@typescript-eslint/rule-tester';
import rule from '../src/rules/prefer-is-empty.js';

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
});

ruleTester.run('prefer-is-empty', rule, {
	valid: [
		'_.isEmpty(values);',
		'!_.isEmpty(values);',
		'Array.isArray(values);',
		'values.size > 0;', // Non-length property
	],

	invalid: [
		// Values.length === 0
		{
			code: 'values.length === 0;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'values',
						operator: '===',
						value: 0,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'values',
								operator: '===',
								value: 0,
							},
							output: '_.isEmpty(values);',
						},
					],
				},
			],
		},

		// Values.length < 1
		{
			code: 'values.length < 1;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'values',
						operator: '<',
						value: 1,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'values',
								operator: '<',
								value: 1,
							},
							output: '_.isEmpty(values);',
						},
					],
				},
			],
		},

		// Values.length <= 0
		{
			code: 'values.length <= 0;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'values',
						operator: '<=',
						value: 0,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'values',
								operator: '<=',
								value: 0,
							},
							output: '_.isEmpty(values);',
						},
					],
				},
			],
		},

		// Values.length > 0 (NEGATIVE check)
		{
			code: 'values.length > 0;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'values',
						operator: '>',
						value: 0,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'values',
								operator: '>',
								value: 0,
							},
							output: '!_.isEmpty(values);',
						},
					],
				},
			],
		},

		// Values.length >= 1
		{
			code: 'values.length >= 1;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'values',
						operator: '>=',
						value: 1,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'values',
								operator: '>=',
								value: 1,
							},
							output: '!_.isEmpty(values);',
						},
					],
				},
			],
		},

		// Values.length !== 0
		{
			code: 'values.length !== 0;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'values',
						operator: '!==',
						value: 0,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'values',
								operator: '!==',
								value: 0,
							},
							output: '!_.isEmpty(values);',
						},
					],
				},
			],
		},

		// If (items.length > 0) {}
		{
			code: 'if (items.length > 0) {}',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'items',
						operator: '>',
						value: 0,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'items',
								operator: '>',
								value: 0,
							},
							output: 'if (!_.isEmpty(items)) {}',
						},
					],
				},
			],
		},

		// 0 === items.length
		{
			code: '0 === items.length;',
			errors: [
				{
					messageId: 'useIsEmpty',
					data: {
						collection: 'items',
						operator: '===',
						value: 0,
					},
					suggestions: [
						{
							messageId: 'useIsEmpty',
							data: {
								collection: 'items',
								operator: '===',
								value: 0,
							},
							output: '_.isEmpty(items);',
						},
					],
				},
			],
		},
	],
});
