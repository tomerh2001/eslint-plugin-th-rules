/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../../src/rules/no-boolean-coercion';

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			projectService: {
				allowDefaultProject: ['*.ts*'],
			},
			tsconfigRootDir: '/../..',
		},
	},
});

ruleTester.run('no-boolean-coercion', rule, {
	valid: ['_.isNil(value);', '_.isEmpty(list);', 'if (value != null) {}', 'if (list.length > 0) {}', 'Boolean;', 'const BooleanValue = true;', 'const fn = Boolean;'],
	invalid: [
		{
			code: 'Boolean(foo);',
			errors: [
				{
					messageId: 'useIsNil',
					suggestions: [
						{
							messageId: 'useIsNil',
							data: { collection: 'foo' },
							output: '!_.isNil(foo);',
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
							messageId: 'useIsNil',
							data: { collection: 'bar' },
							output: 'const x = !_.isNil(bar);',
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
							messageId: 'useIsNil',
							data: { collection: 'value' },
							output: '!_.isNil(value);',
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
							messageId: 'useIsEmpty',
							data: { collection: '[]' },
							output: '!_.isEmpty([]);',
						},
					],
				},
			],
		},
	],
});
