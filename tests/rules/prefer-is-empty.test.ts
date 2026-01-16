/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/prefer-is-empty';

const ruleTester = new RuleTester({});

ruleTester.run('prefer-is-empty', rule, {
	valid: ['_.isEmpty(values);', '!_.isEmpty(values);', 'Array.isArray(values);', 'values.size > 0;'],

	invalid: [
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
